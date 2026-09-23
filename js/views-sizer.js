/* Solar Sizer: appliances in, recommended package out */
(function () {
  const I = EW.icon, S = EW.store;
  const HOURS = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24];

  const st = EW.sizerState = {
    step: 1,
    prop: 'home',
    sel: {},                    // id -> { qty, hours }
    opts: { goal: 'hybrid', outage: 8 },
    room: 'kitchen',
    q: '',
    pick: null,                 // package slug chosen on results
  };
  if (S.sizer) Object.assign(st, S.sizer, { step: 1, pick: null });
  const persist = () => { S.sizer = { prop: st.prop, sel: st.sel, opts: st.opts }; S.save(); };

  const hero = (title, sub) => `
    <section class="page-hero" style="padding-bottom:clamp(28px,4vw,48px)">
      <div class="bg"><img src="${EW.img('installer-sunset')}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <span>Solar Sizer</span></div>
        <h1 class="h1">${title}</h1><p>${sub}</p>
      </div>
    </section>`;

  const stepsBar = () => `<div class="steps">${[['1', 'Property & goals'], ['2', 'Your appliances'], ['3', 'Recommendation']].map(([n, t], k) =>
    `<button class="st ${st.step === k + 1 ? 'on' : st.step > k + 1 ? 'done' : ''}" data-step="${k + 1}"><i>${st.step > k + 1 ? '✓' : n}</i>${t}</button>`).join('')}</div>`;

  EW.views.sizer = params => {
    if (params.s) {
      const d = EW.sizer.decode(params.s);
      if (d && Object.keys(d.sel).length) { st.sel = d.sel; st.opts = d.opts; st.step = params.step ? +params.step : 3; }
    }
    return hero('Tell us what you power. <span class="accent">We\'ll size it.</span>',
      'Pick your appliances, set your hours and load-shedding, and get an engineered solar recommendation with pricing. It takes about 60 seconds.') +
      `<section class="section-tight"><div class="container" data-sizer></div></section>`;
  };

  EW.views.sizer.mount = root => {
    const host = EW.$('[data-sizer]', root);
    const render = () => {
      host.innerHTML = stepsBar() + (st.step === 1 ? step1() : st.step === 2 ? step2() : step3());
      bind();
      if (st.step === 2) drawSummary();
    };

    /* ---------- step 1 ---------- */
    const step1 = () => `
      <div class="sizer">
        <div class="stack-lg">
          <div><div class="h3">What are we powering?</div>
            <div class="tiles mt-2" data-prop>${[['home', 'Home', 'House, flat or cottage'], ['business', 'Business', 'Office, shop, clinic, school'], ['farm', 'Farm', 'Irrigation, cold rooms, workshops']].map(([v, t, d]) => `<button class="tile ${st.prop === v ? 'on' : ''}" data-v="${v}"><b>${t}</b><span>${d}</span></button>`).join('')}</div></div>
          <div><div class="h3">What's your main goal?</div>
            <div class="tiles mt-2" data-goal>${[['backup', 'Beat load-shedding', 'Keep essentials on during power cuts'], ['hybrid', 'Cut my bills', 'Run mostly on solar, with ZESA as backup'], ['offgrid', 'Go fully off-grid', 'No ZESA at all. Needs more battery']].map(([v, t, d]) => `<button class="tile ${st.opts.goal === v ? 'on' : ''}" data-v="${v}"><b>${t}</b><span>${d}</span></button>`).join('')}</div></div>
          <div class="card">
            <div class="between"><div class="h4">Load-shedding per day</div><b class="h3 num" data-out-outage>${st.opts.outage} hrs</b></div>
            <input class="mt-2" type="range" min="0" max="18" step="1" value="${st.opts.outage}" data-outage>
            <div class="between tiny"><span>None</span><span>Typical: 6 to 12 hrs</span><span>18 hrs</span></div>
          </div>
          <div><div class="h3">Start from a typical profile <span class="small">(optional)</span></div>
            <div class="row mt-2" style="gap:8px">${Object.entries(EW.presets).map(([k, p]) => `<button class="btn btn-outline btn-sm" data-preset="${k}">${p.label}</button>`).join('')}
            ${Object.keys(st.sel).length ? `<button class="btn btn-ghost btn-sm" data-clear>${I('refresh', 'sm')} Clear my selection</button>` : ''}</div></div>
          <div class="row"><button class="btn btn-dark btn-lg" data-next>Choose appliances ${I('arrowR', 'sm arrow')}</button></div>
        </div>
        <aside class="summary-card">
          <span class="eyebrow" style="color:#b6ec8e">How it works</span>
          <div class="h3" style="color:#fff">An engineer's method, done in your browser</div>
          <ul class="check-list" style="color:rgba(255,255,255,.85)">
            <li>We add up each appliance's running watts, start-up surge and hours of use</li>
            <li>We model a 24-hour day: solar output, your usage pattern and the battery charge</li>
            <li>We match the result to EcoWealth packages and show where each one falls short</li>
            <li>You get a shareable result, a parts list and financing options</li>
          </ul>
        </aside>
      </div>`;

    /* ---------- step 2 ---------- */
    const count = room => EW.appliances.filter(a => a.room === room && st.sel[a.id]?.qty).length;
    const applCard = a => {
      const s = st.sel[a.id], on = !!s?.qty;
      return `<div class="appl ${on ? 'on' : ''}" data-id="${a.id}">
        <button class="top" data-toggle style="all:unset;display:flex;gap:12px;align-items:center;cursor:pointer">
          <span class="ic">${I(a.ic)}</span>
          <span><span class="nm" style="display:block">${a.name}</span><span class="w">${a.w >= 1000 ? EW.fmt(a.w / 1000, 1) + 'kW' : a.w + 'W'}${a.surge > 1.5 ? ' · motor start' : ''}</span></span>
        </button>
        ${a.heavy ? `<span class="heavy">⚡ Heavy load</span>` : ''}
        <div class="ctrl">
          <div class="qty"><button data-q="-1" aria-label="Fewer">${I('minus', 'sm')}</button><span>${s?.qty || 0}</span><button data-q="1" aria-label="More">${I('plus', 'sm')}</button></div>
          <label class="hrs">${I('clock', 'sm')}<select data-h aria-label="Hours per day">${HOURS.map(h => `<option value="${h}" ${(s?.hours ?? a.h) == h ? 'selected' : ''}>${h < 1 ? h * 60 + 'm' : h + 'h'}</option>`).join('')}</select></label>
        </div>
      </div>`;
    };
    const step2 = () => {
      const q = st.q.toLowerCase();
      const list = EW.appliances.filter(a => q ? a.name.toLowerCase().includes(q) : a.room === st.room);
      return `
      <div class="sizer">
        <div>
          <div class="toolbar">
            <div class="room-tabs" style="margin:0">${EW.rooms.map(r => `<button class="${!q && st.room === r.id ? 'on' : ''}" data-room="${r.id}">${I(r.ic, 'sm')} ${r.name}${count(r.id) ? `<span class="n">${count(r.id)}</span>` : ''}</button>`).join('')}</div>
            <label class="search" style="max-width:260px">${I('search', 'sm')}<input type="search" placeholder="Find an appliance" value="${EW.esc(st.q)}" data-q-search></label>
          </div>
          <div class="appl-grid" data-grid>${list.map(applCard).join('') || '<div class="empty" style="grid-column:1/-1">No appliance matches that search.</div>'}</div>
          <p class="tiny mt-2">Watts are typical values. Check the label on your appliance for exact figures. Our engineers confirm everything at the free site survey.</p>
          <div class="row mt-3"><button class="btn btn-outline" data-back>${I('arrowL', 'sm')} Back</button></div>
        </div>
        <aside class="summary-card" data-summary></aside>
      </div>`;
    };
    const drawSummary = () => {
      const box = EW.$('[data-summary]', host); if (!box) return;
      const n = Object.values(st.sel).filter(v => v.qty).length;
      if (!n) { box.innerHTML = `<span class="eyebrow" style="color:#b6ec8e">Live estimate</span><div class="h3" style="color:#fff">Select appliances to begin</div><p style="color:rgba(255,255,255,.7);margin:0;font-size:14px">Tap an appliance card to add it. Change the quantity and hours to match how you use it.</p>`; return; }
      const r = EW.sizer.size(st.sel, st.opts), b = r.match.best.p;
      box.innerHTML = `
        <div class="between"><span class="eyebrow" style="color:#b6ec8e">Live estimate</span><span class="chip green">${n} appliance${n > 1 ? 's' : ''}</span></div>
        <div><div class="tiny" style="color:rgba(255,255,255,.6)">Daily energy</div><div class="big num">${EW.fmt(r.need.dailyKWh)} <small style="font-size:18px">kWh</small></div></div>
        <div class="row between"><span>Peak load</span><b class="num">${EW.fmt(r.need.peakW / 1000, 2)} kW</b></div>
        <div class="row between"><span>Start-up surge</span><b class="num">${EW.fmt(r.need.surgeW / 1000, 2)} kW</b></div>
        <div class="row between"><span>Night-time energy</span><b class="num">${EW.fmt(r.need.nightKWh)} kWh</b></div>
        <hr style="border:0;border-top:1px solid rgba(255,255,255,.12);margin:0;width:100%">
        <div class="tiny" style="color:rgba(255,255,255,.6)">Best match so far</div>
        <div class="between"><div><div class="h4" style="color:#fff">${b.full}</div><div class="tiny" style="color:rgba(255,255,255,.6)">${b.pvKW}kWp · ${b.batteryKWh}kWh</div></div><b class="h4">${EW.money(b.price)}</b></div>
        ${r.match.custom ? `<div class="tip" style="color:var(--ink)">${I('info', 'sm')}<span>Your load is bigger than our standard packages. We'll design a custom system.</span></div>` : ''}
        <div class="sel">${r.items.map(i => `<span>${i.qty}× ${i.name.replace(/ \(.*\)/, '')}</span>`).join('')}</div>
        <button class="btn btn-green btn-lg btn-block" data-go-result>See my recommendation ${I('arrowR', 'sm arrow')}</button>`;
      EW.$('[data-go-result]', box).onclick = () => { st.step = 3; st.pick = null; persist(); EW.replace('/sizer?s=' + EW.sizer.encode(st.sel, st.opts)); render(); window.scrollTo({ top: root.querySelector('.section-tight').offsetTop - 80, behavior: 'smooth' }); };
    };

    /* ---------- step 3 ---------- */
    const step3 = () => {
      const r = EW.sizer.size(st.sel, st.opts);
      if (!r.items.length) { st.step = 2; return step2(); }
      const m = r.match;
      const chosen = (st.pick && EW.packages.find(p => p.slug === st.pick)) || m.best.p;
      const sim = EW.sizer.simulate(r, chosen);
      const eco = EW.sizer.economics(chosen, sim, r.need.dailyKWh);
      const kit = EW.sizer.customKit(r.need);
      const cov = EW.sizer.coverage(chosen, r.need);
      const tiers = [m.budget, m.best, m.upgrade].filter(Boolean);
      const top = r.items.slice(0, 8), maxWh = top[0]?.dailyWh || 1;

      // what-if tips: remove each heavy load and re-match
      const tips = r.heavy.map(h => {
        const sel2 = { ...st.sel }; delete sel2[h.id];
        const r2 = EW.sizer.size(sel2, st.opts);
        const saved = m.best.p.price - r2.match.best.p.price;
        return { h, saved, to: r2.match.best.p, kwh: h.dailyWh / 1000 };
      }).sort((a, b) => b.saved - a.saved || b.kwh - a.kwh);

      return `
      <div class="result-hero">
        <div class="rec-card">
          <div class="ph"><img src="${EW.img(chosen.img)}" alt=""><span class="chip green">${chosen.slug === m.best.p.slug ? (m.custom ? 'Closest standard package' : '✓ Recommended for you') : 'Your selection'}</span></div>
          <div class="bd">
            <div class="between" style="align-items:flex-start">
              <div><div class="h2" style="color:#fff">${chosen.full}</div><div class="small" style="color:rgba(255,255,255,.65)">${chosen.blurb}</div></div>
              <div style="text-align:right"><div class="h3" style="color:#fff">${EW.money(chosen.price)}</div><div class="tiny" style="color:rgba(255,255,255,.6)">installed · or ${EW.money(Math.round(chosen.price * 1.05 / 12))}/mo</div></div>
            </div>
            <div class="specs4">
              <div><b>${chosen.kva}kVA</b><small>Inverter (need ${EW.fmt(r.need.invKW, 1)})</small></div>
              <div><b>${chosen.pvKW}kWp</b><small>Solar (need ${EW.fmt(r.need.pvKW, 1)})</small></div>
              <div><b>${chosen.batteryKWh}kWh</b><small>Battery (need ${EW.fmt(r.need.battKWh, 1)})</small></div>
              <div><b>${Math.round(cov * 100)}%</b><small>Of your needs met</small></div>
            </div>
            <div class="row">
              <button class="btn btn-green btn-lg" data-add-pkg="${chosen.slug}">${I('bag', 'sm')} Add to cart</button>
              <a class="btn btn-white btn-lg" href="#/packages/${chosen.slug}">Package details</a>
              <button class="btn btn-ghost" style="color:#fff" data-survey>${I('pin', 'sm')} Book free site survey</button>
            </div>
          </div>
        </div>
        <div class="stack">
          <div class="metric-grid">
            <div class="metric"><b class="num">${EW.fmt(r.need.dailyKWh)} kWh</b><span>Your daily energy use</span></div>
            <div class="metric"><b class="num">${Math.round(sim.selfSufficiency * 100)}%</b><span>Powered by solar + battery</span></div>
            <div class="metric"><b class="num">${EW.money(eco.monthlyBlended)}</b><span>Est. monthly savings*</span></div>
            <div class="metric"><b class="num">${EW.fmt(eco.payback, 1)} yrs</b><span>Estimated payback</span></div>
            <div class="metric"><b class="num">${EW.fmt(Math.min(sim.backupHours, 99), 0)} hrs</b><span>Backup at your average load</span></div>
            <div class="metric"><b class="num">${EW.fmt(eco.co2 / 1000, 1)} t</b><span>CO₂ avoided per year</span></div>
          </div>
          <div class="card soft stack-sm">
            <div class="h4">Share or save this result</div>
            <div class="row" style="gap:8px">
              <a class="btn btn-dark btn-sm" target="_blank" rel="noopener" data-wa>${I('whatsapp', 'sm')} Send to EcoWealth</a>
              <button class="btn btn-outline btn-sm" data-copy>${I('copy', 'sm')} Copy link</button>
              <button class="btn btn-outline btn-sm" data-print>${I('print', 'sm')} Print</button>
              <button class="btn btn-ghost btn-sm" data-edit>${I('arrowL', 'sm')} Edit appliances</button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <div class="sec-head" style="margin-bottom:20px"><h2 class="h3">Three ways to go solar</h2><span class="sec-note">Select a tier to re-run the 24-hour simulation.</span></div>
        <div class="tier-row">
          ${tiers.map(t => `
            <div class="tier ${t.p.slug === chosen.slug ? 'best' : ''}">
              <span class="flag chip ${t.label === 'Recommended' ? 'green' : ''}">${t.label}</span>
              <div class="between" style="margin-top:4px"><div class="h4">${t.p.full}</div><b>${EW.money(t.p.price)}</b></div>
              <div class="tiny">${t.p.pvKW}kWp · ${t.p.batteryKWh}kWh · ${t.p.panels} panels</div>
              <div class="coverage"><span class="tiny" style="width:78px">Covers ${Math.round(t.cov * 100)}%</span><div class="progress"><i style="width:${t.cov * 100}%;background:${t.cov >= .95 ? 'var(--green)' : t.cov > .7 ? 'var(--warn)' : 'var(--danger)'}"></i></div></div>
              <div class="small">${t.why}</div>
              ${t.cannot?.length ? `<div class="tiny" style="color:#8a5a00">Can't run at full load: ${t.cannot.slice(0, 3).join(', ')}</div>` : ''}
              <button class="btn ${t.p.slug === chosen.slug ? 'btn-dark' : 'btn-outline'} btn-sm" data-pick="${t.p.slug}">${t.p.slug === chosen.slug ? 'Selected' : 'Simulate this'}</button>
            </div>`).join('')}
        </div>
      </div>

      <div class="grid-2 grid-wide mt-4" style="align-items:start">
        <div class="card" style="padding:24px">
          <div class="between" style="margin-bottom:6px"><div class="h4">A typical day on ${chosen.name}</div><span class="tiny">Clear-sky day · Harare</span></div>
          <div class="legend" style="margin-bottom:10px"><span><i style="background:#b6ec8e"></i>Solar output</span><span><i style="background:#2b302c"></i>Your usage</span><span><i style="background:var(--green);height:3px"></i>Battery %</span>${sim.importKWh > 0.05 ? '<span><i style="background:#e0a126"></i>Grid / generator</span>' : ''}</div>
          ${dayChart(sim)}
          <p class="small" style="margin:10px 0 0">Battery stays above <b>${Math.round(sim.minSoc * 100)}%</b> of usable capacity.${sim.importKWh > 0.05 ? ` About <b>${EW.fmt(sim.importKWh)} kWh</b> a day still comes from ZESA or a generator.` : ' Your whole day runs on solar and battery.'}</p>
        </div>
        <div class="card" style="padding:24px">
          <div class="h4" style="margin-bottom:16px">Where your energy goes</div>
          <div class="stack-sm">${top.map(i => `
            <div><div class="between small" style="color:var(--ink)"><span>${i.qty}× ${i.name}</span><b class="num">${EW.fmt(i.dailyWh / 1000, 2)} kWh</b></div>
            <div class="progress" style="margin-top:6px"><i style="width:${i.dailyWh / maxWh * 100}%;background:${i.heavy ? 'var(--warn)' : 'var(--green)'}"></i></div></div>`).join('')}
          </div>
        </div>
      </div>

      ${tips.length ? `
      <div class="mt-4">
        <h2 class="h3" style="margin-bottom:16px">Smart ways to save</h2>
        <div class="tips">${tips.map(t => `
          <div class="tip ${t.saved > 0 ? 'good' : ''}">
            <span>${I(t.saved > 0 ? 'leaf' : 'info')}</span>
            <div style="flex:1"><b>${t.h.name}</b> uses ${EW.fmt(t.kwh, 1)} kWh/day at ${EW.fmt(t.h.w / 1000, 1)}kW. ${t.h.alt}
              ${t.saved > 0 ? `<br><span class="accent" style="font-weight:500">Take it off and ${t.to.full} is enough. You'd save ${EW.money(t.saved)}.</span>` : ''}</div>
            <button class="btn btn-outline btn-xs" data-drop="${t.h.id}">Remove & re-size</button>
          </div>`).join('')}
        </div>
        ${r.items.some(i => i.id === 'geyser') ? `<a class="btn btn-lime btn-sm mt-2" href="#/shop?cat=geysers">Shop solar geysers ${I('arrowR', 'sm arrow')}</a>` : ''}
      </div>` : ''}

      <div class="mt-4 card" style="padding:24px">
        <div class="between" style="margin-bottom:14px"><div><div class="h4">Prefer to build it yourself?</div><div class="small">A custom parts list matched to your exact numbers, from the EcoWealth shop.</div></div>
          <button class="btn btn-dark btn-sm" data-add-kit>${I('bag', 'sm')} Add all to cart · ${EW.money(kit.total)}</button></div>
        <div class="table-wrap"><table class="spec-table" style="min-width:560px">
          <thead><tr><th style="width:auto">Component</th><th style="width:auto">Qty</th><th style="width:auto">Unit</th><th style="width:auto;text-align:right">Line total</th></tr></thead>
          <tbody>${kit.lines.map(l => `<tr><td><a href="#/shop/${l.p.id}" style="text-decoration:underline;text-underline-offset:3px">${l.p.name}</a></td><td>${l.q}</td><td>${EW.money(l.p.price)}</td><td style="text-align:right">${EW.money(l.p.price * l.q)}</td></tr>`).join('')}
            <tr><td colspan="3" class="small">Optional professional installation (quoted separately)</td><td style="text-align:right" class="small">≈ ${EW.money(kit.install)}</td></tr></tbody>
        </table></div>
      </div>

      <div class="mt-4 card soft" style="padding:24px">
        <div class="between" style="margin-bottom:8px"><div class="h4">25-year savings outlook</div><span class="tiny">Includes 8%/yr tariff growth &amp; 0.5%/yr panel ageing</span></div>
        ${savingsChart(eco.yearly)}
      </div>
      <p class="tiny mt-2">* Savings value solar energy at a blend of the ZESA tariff ($${EW.K.GRID_TARIFF}/kWh) and generator running cost ($${EW.K.GEN_COST}/kWh). These are estimates for the demo. A free site survey confirms the final design and price.</p>`;
    };

    /* ---------- SVG charts ---------- */
    function dayChart(sim) {
      const W = 640, H = 240, pl = 34, pr = 34, pt = 10, pb = 26, cw = W - pl - pr, ch = H - pt - pb;
      const max = Math.max(...sim.rows.map(r => Math.max(r.pv, r.load)), 100) * 1.1;
      const x = h => pl + (h / 24) * cw, bw = cw / 24;
      const y = v => pt + ch - (v / max) * ch;
      const pvPath = 'M' + x(0) + ',' + y(0) + sim.rows.map(r => `L${x(r.h + 0.5)},${y(r.pv)}`).join('') + `L${x(24)},${y(0)}Z`;
      const socPath = sim.rows.map((r, i) => `${i ? 'L' : 'M'}${x(r.h + 1)},${pt + ch - r.soc * ch}`).join('');
      const grid = [0, .25, .5, .75, 1].map(k => `<line x1="${pl}" x2="${W - pr}" y1="${pt + ch - k * ch}" y2="${pt + ch - k * ch}" stroke="#eef0ed"/><text x="${W - pr + 6}" y="${pt + ch - k * ch + 4}" font-size="10" fill="#9aa09b">${k * 100}%</text><text x="${pl - 6}" y="${pt + ch - k * ch + 4}" font-size="10" fill="#9aa09b" text-anchor="end">${EW.fmt(max * k / 1000, 1)}</text>`).join('');
      return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="24-hour solar, usage and battery chart">
        ${grid}
        <text x="${pl - 6}" y="${H - 6}" font-size="10" fill="#9aa09b" text-anchor="end">kW</text>
        <path d="${pvPath}" fill="#b6ec8e" opacity=".75"/>
        ${sim.rows.map(r => `<rect x="${x(r.h) + bw * 0.22}" y="${y(r.load)}" width="${bw * 0.56}" height="${Math.max(0, pt + ch - y(r.load))}" rx="2" fill="#2b302c"><title>${String(r.h).padStart(2, '0')}:00: use ${EW.fmt(r.load / 1000, 2)} kWh, solar ${EW.fmt(r.pv / 1000, 2)} kWh, battery ${Math.round(r.soc * 100)}%</title></rect>
          ${r.imp > 5 ? `<rect x="${x(r.h) + bw * 0.22}" y="${y(r.imp)}" width="${bw * 0.56}" height="${pt + ch - y(r.imp)}" rx="2" fill="#e0a126"/>` : ''}`).join('')}
        <path d="${socPath}" fill="none" stroke="#6fc243" stroke-width="2.5" stroke-linejoin="round"/>
        ${[0, 6, 12, 18, 24].map(h => `<text x="${x(h)}" y="${H - 8}" font-size="10" fill="#9aa09b" text-anchor="middle">${String(h % 24).padStart(2, '0')}:00</text>`).join('')}
      </svg>`;
    }
    function savingsChart(yearly) {
      const W = 640, H = 170, pl = 50, pr = 10, pt = 10, pb = 22, cw = W - pl - pr, ch = H - pt - pb;
      const mn = Math.min(0, ...yearly), mx = Math.max(...yearly, 1);
      const y = v => pt + ch - ((v - mn) / (mx - mn)) * ch, bw = cw / yearly.length;
      return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Cumulative savings over 25 years">
        <line x1="${pl}" x2="${W - pr}" y1="${y(0)}" y2="${y(0)}" stroke="#cfd3ce"/>
        <text x="${pl - 6}" y="${y(0) + 4}" font-size="10" fill="#9aa09b" text-anchor="end">$0</text>
        <text x="${pl - 6}" y="${y(mx) + 8}" font-size="10" fill="#9aa09b" text-anchor="end">${EW.money(mx / 1000)}k</text>
        ${yearly.map((v, i) => `<rect x="${pl + i * bw + 2}" width="${bw - 4}" y="${Math.min(y(v), y(0))}" height="${Math.abs(y(v) - y(0))}" rx="2" fill="${v < 0 ? '#e7c3c1' : '#6fc243'}"><title>Year ${i + 1}: ${EW.money(v)}</title></rect>`).join('')}
        ${[1, 5, 10, 15, 20, 25].map(k => `<text x="${pl + (k - .5) * bw}" y="${H - 6}" font-size="10" fill="#9aa09b" text-anchor="middle">Yr ${k}</text>`).join('')}
      </svg>`;
    }

    /* ---------- binding ---------- */
    function bind() {
      EW.$$('[data-step]', host).forEach(b => b.onclick = () => {
        const n = +b.dataset.step;
        if (n === 3 && !Object.values(st.sel).some(v => v.qty)) { EW.toast('Add at least one appliance first'); return; }
        st.step = n; render();
      });
      if (st.step === 1) {
        EW.$$('[data-prop] .tile', host).forEach(b => b.onclick = () => { st.prop = b.dataset.v; EW.$$('[data-prop] .tile', host).forEach(x => x.classList.toggle('on', x === b)); if (st.prop === 'business' && !Object.keys(st.sel).length) applyPreset('office', true); });
        EW.$$('[data-goal] .tile', host).forEach(b => b.onclick = () => { st.opts.goal = b.dataset.v; EW.$$('[data-goal] .tile', host).forEach(x => x.classList.toggle('on', x === b)); });
        EW.$('[data-outage]', host).oninput = e => { st.opts.outage = +e.target.value; EW.$('[data-out-outage]', host).textContent = st.opts.outage + ' hrs'; };
        EW.$$('[data-preset]', host).forEach(b => b.onclick = () => applyPreset(b.dataset.preset));
        const clr = EW.$('[data-clear]', host); if (clr) clr.onclick = () => { st.sel = {}; persist(); render(); };
        EW.$('[data-next]', host).onclick = () => { st.step = 2; persist(); render(); };
      }
      if (st.step === 2) {
        EW.$$('[data-room]', host).forEach(b => b.onclick = () => { st.room = b.dataset.room; st.q = ''; render(); });
        const qs = EW.$('[data-q-search]', host);
        qs.oninput = () => { st.q = qs.value; const pos = qs.selectionStart; render(); const n = EW.$('[data-q-search]', host); n.focus(); n.setSelectionRange(pos, pos); };
        EW.$('[data-back]', host).onclick = () => { st.step = 1; render(); };
        bindCards();
      }
      if (st.step === 3) {
        EW.$$('[data-pick]', host).forEach(b => b.onclick = () => { st.pick = b.dataset.pick; render(); });
        EW.$$('[data-add-pkg]', host).forEach(b => b.onclick = () => S.addPackage(b.dataset.addPkg));
        EW.$$('[data-drop]', host).forEach(b => b.onclick = () => { delete st.sel[b.dataset.drop]; st.pick = null; persist(); EW.replace('/sizer?s=' + EW.sizer.encode(st.sel, st.opts)); render(); EW.toast('Removed and re-sized'); });
        EW.$('[data-edit]', host).onclick = () => { st.step = 2; render(); };
        EW.$('[data-print]', host).onclick = () => window.print();
        const link = location.href.split('#')[0] + '#/sizer?s=' + EW.sizer.encode(st.sel, st.opts);
        EW.$('[data-copy]', host).onclick = () => EW.share('My EcoWealth solar recommendation', link);
        const r = EW.sizer.size(st.sel, st.opts), chosen = (st.pick && EW.packages.find(p => p.slug === st.pick)) || r.match.best.p;
        EW.$('[data-wa]', host).href = EW.waLink(`Hi EcoWealth! The Solar Sizer recommended the ${chosen.full} (${EW.money(chosen.price)}) for me.\nDaily use: ${EW.fmt(r.need.dailyKWh)} kWh, peak ${EW.fmt(r.need.peakW / 1000, 2)} kW.\nAppliances: ${r.items.map(i => `${i.qty}× ${i.name}`).join(', ')}.\nMy result: ${link}`);
        EW.$('[data-add-kit]', host).onclick = () => { EW.sizer.customKit(r.need).lines.forEach(l => S.addProduct(l.p.id, l.q, true)); EW.toast('Parts list added to cart', 'View cart', EW.openCart); };
        EW.$('[data-survey]', host).onclick = () => EW.surveyModal(chosen, r);
      }
    }
    function bindCards() {
      EW.$$('.appl', host).forEach(card => {
        const id = card.dataset.id, a = EW.appliances.find(x => x.id === id);
        const set = qty => {
          const hours = +EW.$('[data-h]', card).value;
          if (qty <= 0) delete st.sel[id]; else st.sel[id] = { qty: Math.min(qty, 50), hours };
          card.classList.toggle('on', qty > 0);
          EW.$('.qty span', card).textContent = st.sel[id]?.qty || 0;
          EW.$$('[data-room]', host).forEach(b => { const n = count(b.dataset.room); let badge = b.querySelector('.n'); if (n) { if (!badge) { badge = document.createElement('span'); badge.className = 'n'; b.appendChild(badge); } badge.textContent = n; } else if (badge) badge.remove(); });
          persist(); drawSummary();
        };
        EW.$('[data-toggle]', card).onclick = () => set(st.sel[id]?.qty ? 0 : (a.qty || 1));
        EW.$$('[data-q]', card).forEach(b => b.onclick = () => set((st.sel[id]?.qty || 0) + +b.dataset.q));
        EW.$('[data-h]', card).onchange = () => { if (st.sel[id]) set(st.sel[id].qty); };
      });
    }
    function applyPreset(k, quiet) {
      st.sel = {};
      Object.entries(EW.presets[k].items).forEach(([id, q]) => { const a = EW.appliances.find(x => x.id === id); st.sel[id] = { qty: q, hours: a.h }; });
      persist();
      if (!quiet) { st.step = 2; render(); EW.toast(`Loaded “${EW.presets[k].label}”. Adjust it to match your home.`); }
    }

    render();
  };

  EW.surveyModal = (p, r) => {
    const box = EW.openModal(`
      <div style="padding:clamp(22px,4vw,40px)">
        <span class="eyebrow">Free in Harare</span>
        <h2 class="h2" style="margin:10px 0 6px">Book a site survey</h2>
        <p class="small" style="margin:0 0 20px">An engineer checks your roof, wiring and shading, then confirms the final design${p ? ` for the <b>${p.full}</b>` : ''}.</p>
        <form class="form-grid" data-survey-form novalidate>
          <div class="field"><label>Full name</label><input class="input" name="name" required></div>
          <div class="field"><label>Phone / WhatsApp</label><input class="input" name="phone" required placeholder="+263 7…"></div>
          <div class="field"><label>Area</label><select class="select" name="zone">${EW.zones.filter(z => z.km).map(z => `<option>${z.name}</option>`).join('')}</select></div>
          <div class="field"><label>Preferred date</label><input class="input" type="date" name="date" min="${new Date(Date.now() + 864e5).toISOString().slice(0, 10)}"></div>
          <div class="field full"><label>Anything we should know?</label><textarea class="textarea" name="note" placeholder="Roof type, access, existing inverter…"></textarea></div>
          <div class="full row"><button class="btn btn-green btn-lg">Request survey ${EW.icon('arrowR', 'sm arrow')}</button><span class="tiny">We reply within 2 working hours.</span></div>
        </form>
      </div>`);
    box.style.width = 'min(640px,100%)';
    EW.$('[data-survey-form]', box).onsubmit = e => {
      e.preventDefault();
      const f = e.target; let ok = true;
      ['name', 'phone'].forEach(n => { const el = f[n]; const bad = !el.value.trim() || (n === 'phone' && el.value.replace(/\D/g, '').length < 9); el.classList.toggle('err', bad); if (bad) ok = false; });
      if (!ok) return;
      const ref = 'SV-' + Math.random().toString(36).slice(2, 7).toUpperCase();
      box.innerHTML = `<div style="padding:48px 32px;text-align:center"><div class="success-ring">${EW.icon('check')}</div><h2 class="h2">Survey requested</h2><p class="lead" style="margin:10px auto">Thanks, ${EW.esc(f.name.value.split(' ')[0])}. Your reference is <b>${ref}</b>. An EcoWealth engineer will call you on ${EW.esc(f.phone.value)} to confirm a time.</p><button class="btn btn-dark mt-2" onclick="EW.closeOverlays()">Done</button></div>`;
    };
  };
})();
