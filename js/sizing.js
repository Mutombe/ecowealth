/* EcoWealth Solar Sizer engine.
   Turns a list of appliances (qty × hours) into an inverter / battery / PV
   requirement, simulates a 24h day (solar curve vs load vs battery), and
   matches the result against the package catalogue. */
(function () {
  const K = EW.K;

  // hour-of-day weights for each usage window (sum normalised later)
  const WINDOWS = {
    all: h => 1,
    day: h => (h >= 8 && h < 17 ? 1 : 0),
    morning: h => (h >= 5 && h < 9 ? 1 : h >= 17 && h < 19 ? 0.35 : 0),
    evening: h => (h >= 17 && h < 23 ? 1 : h >= 6 && h < 8 ? 0.3 : 0),
    night: h => (h >= 19 || h < 6 ? 1 : 0),
  };

  // normalised clear-sky PV shape, 6:00–18:00, integrates to PSH per kWp
  const SOLAR = (() => {
    const raw = [];
    for (let h = 0; h < 24; h++) {
      const x = (h + 0.5 - 12) / 3.1;
      raw.push(h >= 6 && h < 18 ? Math.exp(-0.5 * x * x) : 0);
    }
    const s = raw.reduce((a, b) => a + b, 0);
    return raw.map(v => (v / s) * K.PSH);
  })();

  function hourlyProfile(ap, qty, hours) {
    const fn = WINDOWS[ap.win] || WINDOWS.all;
    const weights = Array.from({ length: 24 }, (_, h) => fn(h));
    const sum = weights.reduce((a, b) => a + b, 0) || 1;
    const dailyWh = ap.w * qty * hours;
    return weights.map(w => (dailyWh * w) / sum); // Wh per hour
  }

  /**
   * @param sel  { [applianceId]: { qty, hours } }
   * @param opts { goal: 'backup'|'hybrid'|'offgrid', outage: hours/day, gas: bool, solarGeyser: bool }
   */
  function size(sel, opts = {}) {
    const goal = opts.goal || 'hybrid';
    const outage = opts.outage ?? 8;
    const items = [];
    const load = new Array(24).fill(0);

    for (const [id, v] of Object.entries(sel)) {
      const ap = EW.appliances.find(a => a.id === id);
      if (!ap || !v.qty) continue;
      const prof = hourlyProfile(ap, v.qty, v.hours);
      prof.forEach((wh, h) => (load[h] += wh));
      const dailyWh = ap.w * v.qty * v.hours;
      const nightWh = prof.reduce((a, wh, h) => a + (SOLAR[h] < 0.15 ? wh : 0), 0);
      items.push({ ...ap, qty: v.qty, hours: v.hours, dailyWh, nightWh, runW: ap.w * v.qty });
    }
    items.sort((a, b) => b.dailyWh - a.dailyWh);

    const dailyWh = items.reduce((a, i) => a + i.dailyWh, 0);
    const nightWh = items.reduce((a, i) => a + i.nightWh, 0);

    // Peak demand: diversity-weighted running load, but never less than the
    // biggest single appliance plus the always-on base load.
    const diversified = items.reduce((a, i) => a + i.runW * i.c, 0);
    const base = items.filter(i => i.c >= 0.9).reduce((a, i) => a + i.runW, 0);
    const biggest = items.reduce((m, i) => (i.w > m.w ? i : m), { w: 0 });
    const peakW = Math.max(diversified, biggest.w + base);
    // Surge: largest motor start on top of the peak
    const surgeW = peakW + items.reduce((m, i) => Math.max(m, i.w * (i.surge - 1)), 0);

    // Inverter: 25% headroom on peak, and surge within 2× rating
    const needInvW = Math.max(peakW * 1.25, surgeW / 2);

    // Battery: cover the night, plus outage cover for goal
    const goalCfg = {
      backup: { nightCover: 0.6, autonomy: 1, pvFactor: 0.7 },
      hybrid: { nightCover: 1, autonomy: 1, pvFactor: 1 },
      offgrid: { nightCover: 1, autonomy: 1.5, pvFactor: 1.3 },
    }[goal];
    const outageWh = (dailyWh / 24) * Math.min(outage, 18) * 0.5; // outages partly overlap daylight
    const usableWh = Math.max(nightWh * goalCfg.nightCover, outageWh) * goalCfg.autonomy;
    const needBattKWh = usableWh / K.BATT_DOD / K.ROUNDTRIP / 1000;

    // PV: produce daily energy (plus battery round-trip loss on night share)
    const pvWh = (dailyWh + nightWh * (1 / K.ROUNDTRIP - 1)) * goalCfg.pvFactor;
    const needPvKW = pvWh / (K.PSH * K.PV_DERATE) / 1000;
    const needPanels = Math.max(1, Math.ceil((needPvKW * 1000) / K.PANEL_W));

    const need = {
      dailyKWh: dailyWh / 1000,
      nightKWh: nightWh / 1000,
      peakW, surgeW,
      invKW: needInvW / 1000,
      battKWh: needBattKWh,
      pvKW: needPvKW,
      panels: needPanels,
    };

    return { items, load, need, opts: { goal, outage }, match: match(need, items), heavy: items.filter(i => i.heavy) };
  }

  // Share of the requirement a package covers (weakest link)
  function coverage(p, need) {
    if (!need.dailyKWh) return 0;
    const inv = p.invW / 1000 / need.invKW;
    const bat = p.batteryKWh / Math.max(need.battKWh, 0.3);
    const pv = p.pvKW / Math.max(need.pvKW, 0.2);
    return Math.min(1, inv, bat * 1.05, pv * 1.1); // small tolerance on energy
  }

  function match(need, items) {
    const pk = [...EW.packages].sort((a, b) => a.price - b.price);
    const scored = pk.map(p => ({ p, cov: coverage(p, need) }));
    let bestIdx = scored.findIndex(s => s.cov >= 0.95);
    const custom = bestIdx === -1;
    if (custom) bestIdx = scored.length - 1;
    const best = scored[bestIdx];
    const budget = bestIdx > 0 ? scored[bestIdx - 1] : null;
    const upgrade = bestIdx < scored.length - 1 ? scored[bestIdx + 1] : null;
    const limits = s => (s ? items.filter(i => i.w * Math.min(i.qty, 1) > s.p.invW * 0.8).map(i => i.name) : []);
    return {
      custom,
      best: { ...best, label: 'Recommended', why: 'Covers all your selected appliances' },
      budget: budget && { ...budget, label: 'Budget', why: 'Lower cost. Run heavy loads one at a time', cannot: limits(budget) },
      upgrade: upgrade && { ...upgrade, label: 'Future-proof', why: 'Room to add appliances later' },
    };
  }

  // 24h simulation for a chosen package: PV, load, battery SoC, grid/gen import
  function simulate(result, p) {
    const pv = SOLAR.map(k => k * p.pvKW * K.PV_DERATE * 1000); // Wh per hour
    const cap = p.batteryKWh * 1000 * K.BATT_DOD;
    let soc = cap * 0.55;
    const rows = [];
    // run two days so the battery reaches steady state, keep the second
    for (let d = 0; d < 2; d++) {
      for (let h = 0; h < 24; h++) {
        const L = result.load[h];
        let net = pv[h] - L, imp = 0, spill = 0;
        if (net >= 0) {
          const room = cap - soc;
          const charge = Math.min(room, net * K.ROUNDTRIP);
          soc += charge;
          spill = net - charge / K.ROUNDTRIP;
        } else {
          const draw = Math.min(soc, -net);
          soc -= draw;
          imp = -net - draw;
        }
        if (d === 1) rows.push({ h, pv: pv[h], load: L, soc: cap ? soc / cap : 0, imp, spill });
      }
    }
    const solarUsed = rows.reduce((a, r) => a + Math.min(r.pv, r.load), 0);
    const imported = rows.reduce((a, r) => a + r.imp, 0);
    const loadTot = rows.reduce((a, r) => a + r.load, 0) || 1;
    return {
      rows,
      selfSufficiency: Math.max(0, 1 - imported / loadTot),
      minSoc: Math.min(...rows.map(r => r.soc)),
      pvKWh: pv.reduce((a, b) => a + b, 0) / 1000,
      importKWh: imported / 1000,
      solarUsedKWh: solarUsed / 1000,
      backupHours: loadTot ? (cap / (loadTot / 24)) : 0,
    };
  }

  // value of a solar kWh: mostly displaces ZESA, partly displaces generator runtime
  const BLEND = K.GRID_TARIFF * 0.75 + K.GEN_COST * 0.25;

  function economics(p, sim, loadKWh) {
    const coveredKWh = loadKWh * sim.selfSufficiency;
    const monthlyGrid = coveredKWh * 30 * K.GRID_TARIFF;
    const monthlyGen = coveredKWh * 30 * K.GEN_COST;
    let cum = -p.price, payback = null;
    const yearly = [];
    for (let y = 1; y <= 25; y++) {
      const v = coveredKWh * 365 * Math.pow(1 - K.DEGRADATION, y - 1) *
        BLEND * Math.pow(1 + K.INFLATION, y - 1);
      const prev = cum; cum += v;
      if (payback === null && cum >= 0) payback = y - 1 + (-prev / v);
      yearly.push(Math.round(cum));
    }
    return {
      monthlyGrid, monthlyGen,
      monthlyBlended: coveredKWh * 30 * BLEND,
      payback: payback ?? 25,
      yearly,
      co2: coveredKWh * 365 * K.CO2_PER_KWH,
    };
  }

  // Build a custom bill of materials from the shop catalogue
  function customKit(need) {
    const by = id => EW.products.find(p => p.id === id);
    // keep inverter and battery on the same bus voltage: 12V gel for tiny
    // systems, otherwise 48V hybrid inverters with 48V (51.2V) lithium
    const inv = need.invKW <= 0.8 ? by('must-1') : need.invKW <= 5 ? by('deye-5') : by('sunsynk-8');
    const invCount = need.invKW > 8 ? Math.ceil(need.invKW / 8) : 1;
    const batt = inv.id === 'must-1' ? by('gel-200') : by('dyness-5');
    const battUnit = batt.id === 'gel-200' ? 2.4 * 0.5 : 5.12;
    const battCount = Math.max(1, Math.ceil(need.battKWh / battUnit));
    const panel = by('ja-550');
    const mounts = Math.ceil(need.panels / 4);
    const lines = [
      { p: panel, q: need.panels },
      { p: inv, q: invCount },
      { p: batt, q: battCount },
      { p: by('mount-ibr'), q: mounts },
      { p: by('pv-cable'), q: 1 },
      { p: by('combiner'), q: 1 },
    ];
    const total = lines.reduce((a, l) => a + l.p.price * l.q, 0);
    const install = Math.round(total * 0.14 + 150);
    return { lines, total, install };
  }

  // encode selection for shareable links
  function encode(sel, opts) {
    const s = Object.entries(sel).filter(([, v]) => v.qty).map(([k, v]) => `${k}.${v.qty}.${v.hours}`).join('_');
    return `${s}~${opts.goal || 'hybrid'}~${opts.outage ?? 8}`;
  }
  function decode(str) {
    try {
      const [s, goal, outage] = decodeURIComponent(str).split('~');
      const sel = {};
      s.split('_').filter(Boolean).forEach(t => {
        const [k, q, h] = t.split('.');
        if (EW.appliances.some(a => a.id === k)) sel[k] = { qty: +q, hours: +h };
      });
      return { sel, opts: { goal: goal || 'hybrid', outage: +outage || 8 } };
    } catch (e) { return null; }
  }

  EW.sizer = { size, simulate, economics, coverage, customKit, encode, decode, SOLAR };
})();
