/* Solar packages: cards, listing, detail, comparison, financing */
(function () {
  const I = EW.icon, S = EW.store;
  const maxKva = 30;

  EW.backupHrs = p => (p.batteryKWh * EW.K.BATT_DOD) / 0.45; // at a typical 450W evening load

  EW.pkgCard = (p, cls = '', i = 0) => `
    <article class="l-card pkg-card ${cls}" style="transition-delay:${i * 60}ms">
      <a class="media" href="#/packages/${p.slug}">
        <img src="${EW.img(p.img, 1)}" alt="${EW.esc(p.full)}" loading="lazy">
        <div class="tl">${p.popular ? '<span class="chip green">★ Popular</span>' : ''}${p.was ? `<span class="chip danger">Save ${EW.money(p.was - p.price)}</span>` : ''}</div>
        <div class="kva"><b>${p.kva}kVA</b><small>${p.tier}</small></div>
      </a>
      <div class="body">
        <a href="#/packages/${p.slug}"><h3 class="title">${p.full}</h3></a>
        <div class="sub">${p.segment === 'home' ? 'Residential' : 'Commercial'} · ${p.phase} · Supply & install</div>
        <div class="specs"><span>${p.pvKW}kWp</span><span>${p.batteryKWh}kWh</span><span>${p.panels} panels</span></div>
        <div class="cap-meter" title="Relative capacity">${Array.from({ length: 10 }, (_, k) => `<i class="${k < Math.max(1, Math.round(Math.log(p.kva + 1) / Math.log(maxKva + 1) * 10)) ? 'on' : ''}"></i>`).join('')}</div>
        <p class="feature"><b>Powers:</b> ${p.powers.slice(0, 3).join(', ')}</p>
        <div class="foot">
          <div class="price">${EW.money(p.price)}${p.was ? `<s>${EW.money(p.was)}</s>` : ''}<br><small>or ${EW.money(Math.round(p.price * 1.05 / 12))}/mo</small></div>
          <a class="btn btn-lime btn-sm" href="#/packages/${p.slug}">Discover</a>
        </div>
      </div>
    </article>`;

  /* ---------------- listing ---------------- */
  const st = { seg: 'all', sort: 'price', budget: 35000, cmp: [] };
  EW.views.packages = () => `
    <section class="page-hero">
      <div class="bg"><img src="${EW.img('panels-trees')}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <span>Packages</span></div>
        <h1 class="h1">Solar packages, <span class="accent">fully installed</span></h1>
        <p>Eight packages from 1kVA to 30kW. Each price includes panels, inverter, lithium storage, installation and monitoring.</p>
        <div class="row mt-3"><a class="btn btn-green" href="#/sizer">Not sure? Get a recommendation ${I('arrowR', 'sm arrow')}</a><a class="btn btn-white" href="#/financing">Financing options</a></div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="toolbar">
          <div class="seg" data-seg>
            ${[['all', 'All'], ['home', 'Residential'], ['business', 'Business']].map(([v, t]) => `<button data-v="${v}" class="${st.seg === v ? 'on' : ''}">${t}</button>`).join('')}
          </div>
          <div class="row" style="gap:16px">
            <label class="row small" style="gap:10px">Budget up to <b class="num" data-budget-out style="color:var(--ink);min-width:60px">${EW.money(st.budget)}</b>
              <input type="range" min="1000" max="35000" step="500" value="${st.budget}" data-budget style="width:160px"></label>
            <select class="select" data-sort style="width:auto;height:40px">
              <option value="price">Price: low to high</option><option value="-price">Price: high to low</option><option value="kva">Capacity</option><option value="battery">Battery size</option>
            </select>
          </div>
        </div>
        <div class="cards-3" data-list></div>
        <div class="empty" data-empty hidden><div class="h3">No packages in that budget</div><p>Try raising the budget, or use the financing calculator to spread the cost.</p></div>
      </div>
    </section>
    <section class="section bg-soft">
      <div class="container">
        <div class="sec-head"><h2 class="h2">Compare packages side by side</h2><p class="sec-note">Tick up to 3 packages below. Rows where they differ are highlighted.</p></div>
        <div class="row" data-pick style="gap:8px;margin-bottom:18px">
          ${EW.packages.map(p => `<label class="chip" style="cursor:pointer;height:36px"><input type="checkbox" value="${p.slug}" style="accent-color:var(--green)"> ${p.full}</label>`).join('')}
        </div>
        <div data-cmp-out></div>
      </div>
    </section>`;

  EW.views.packages.mount = root => {
    const list = EW.$('[data-list]', root);
    const draw = () => {
      let ps = EW.packages.filter(p => (st.seg === 'all' || p.segment === st.seg) && p.price <= st.budget);
      const s = st.sort;
      ps.sort((a, b) => s === 'price' ? a.price - b.price : s === '-price' ? b.price - a.price : s === 'kva' ? b.kva - a.kva : b.batteryKWh - a.batteryKWh);
      list.innerHTML = ps.map((p, i) => EW.pkgCard(p, '', i)).join('');
      EW.$('[data-empty]', root).hidden = ps.length > 0;
    };
    EW.$$('[data-seg] button', root).forEach(b => b.onclick = () => { st.seg = b.dataset.v; EW.$$('[data-seg] button', root).forEach(x => x.classList.toggle('on', x === b)); draw(); });
    EW.$('[data-sort]', root).value = st.sort;
    EW.$('[data-sort]', root).onchange = e => { st.sort = e.target.value; draw(); };
    EW.$('[data-budget]', root).oninput = e => { st.budget = +e.target.value; EW.$('[data-budget-out]', root).textContent = EW.money(st.budget); draw(); };
    draw();

    const out = EW.$('[data-cmp-out]', root);
    const boxes = EW.$$('[data-pick] input', root);
    if (!st.cmp.length) st.cmp = ['sprout-3kva', 'grove-5kva', 'canopy-5kva-plus'];
    const drawCmp = () => {
      boxes.forEach(b => { b.checked = st.cmp.includes(b.value); b.closest('label').classList.toggle('green', b.checked); });
      out.innerHTML = st.cmp.length ? EW.pkgCompareTable(st.cmp.map(s => EW.packages.find(p => p.slug === s))) : '<div class="empty">Pick packages above to compare.</div>';
    };
    boxes.forEach(b => b.onchange = () => {
      if (b.checked && st.cmp.length >= 3) { b.checked = false; EW.toast('Compare up to 3 packages at a time'); return; }
      st.cmp = b.checked ? [...st.cmp, b.value] : st.cmp.filter(x => x !== b.value); drawCmp();
    });
    drawCmp();
  };

  EW.pkgCompareTable = ps => {
    const rows = [
      ['Price', p => EW.money(p.price), 'min', p => p.price],
      ['Inverter', p => `${p.kva}kVA (${p.phase})`, 'max', p => p.kva],
      ['Solar array', p => `${p.pvKW}kWp · ${p.panels} panels`, 'max', p => p.pvKW],
      ['Battery', p => `${p.batteryKWh}kWh`, 'max', p => p.batteryKWh],
      ['Evening backup*', p => `≈ ${Math.round(EW.backupHrs(p))} hrs`, 'max', p => EW.backupHrs(p)],
      ['Daily solar yield', p => `≈ ${EW.fmt(p.pvKW * EW.K.PSH * EW.K.PV_DERATE)} kWh`, 'max', p => p.pvKW],
      ['Monthly (12 mo)', p => EW.money(Math.round(p.price * 1.05 / 12)) + '/mo', 'min', p => p.price],
      ['Powers', p => p.powers.join(', ')],
      ['Not suited to', p => p.cant.length ? p.cant.join(', ') : '—'],
    ];
    return `<div class="table-wrap"><table class="cmp">
      <thead><tr><th></th>${ps.map(p => `<th><div class="ph"><img src="${EW.img(p.img, 1)}" alt=""></div><div class="h4">${p.full}</div><a class="btn btn-lime btn-xs mt-1" href="#/packages/${p.slug}">View</a></th>`).join('')}</tr></thead>
      <tbody>${rows.map(([lab, f, best, v]) => {
      const vals = best ? ps.map(v) : [];
      const target = best === 'min' ? Math.min(...vals) : Math.max(...vals);
      const differ = new Set(ps.map(f)).size > 1;
      return `<tr style="${differ ? '' : 'opacity:.7'}"><th>${lab}</th>${ps.map(p => `<td class="${best && ps.length > 1 && v(p) === target ? 'best' : ''}">${f(p)}</td>`).join('')}</tr>`;
    }).join('')}</tbody></table></div><p class="tiny mt-1">* Evening backup estimated at a typical 450W household load. ✓ Green values are the best in each row.</p>`;
  };

  /* ---------------- detail ---------------- */
  EW.views.packageDetail = ({ slug }) => {
    const p = EW.packages.find(x => x.slug === slug);
    if (!p) return EW.views.notFound();
    const idx = EW.packages.indexOf(p);
    const rel = [EW.packages[idx - 1], EW.packages[idx + 1], EW.packages[idx + 2]].filter(Boolean).slice(0, 3);
    return `
    <section class="page-hero" style="padding-bottom:clamp(32px,5vw,56px)">
      <div class="bg"><img src="${EW.img(p.img)}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <a href="#/packages">Packages</a> / <span>${p.name}</span></div>
        <div class="row" style="gap:8px;margin-bottom:14px"><span class="chip green">${p.tier}</span><span class="chip dark">${p.segment === 'home' ? 'Residential' : 'Commercial'}</span>${p.popular ? '<span class="chip dark">★ Popular</span>' : ''}</div>
        <h1 class="h1">${p.name} <span class="accent">${p.kva}kVA</span> solar system</h1>
        <p>${p.blurb}</p>
      </div>
    </section>
    <section class="section-tight">
      <div class="container pd pd-pkg">
        <div class="stack-lg">
          <div class="gallery" style="position:static">
            <div class="main"><img src="${EW.img(p.gallery[0])}" alt="" data-main></div>
            <div class="thumbs">${p.gallery.map((g, k) => `<button class="${k ? '' : 'on'}" data-g="${g}"><img src="${EW.img(g, 1)}" alt=""></button>`).join('')}</div>
          </div>
          <div class="stats-card">
            <div class="between"><div class="h4">System at a glance</div><span class="tiny">Zimbabwe sun: 5.5 peak hrs/day</span></div>
            <div class="stats">
              <div class="stat"><b>${p.kva}<small style="font-size:.5em">kVA</small></b><span>Inverter</span></div>
              <div class="stat"><b>${p.pvKW}<small style="font-size:.5em">kWp</small></b><span>${p.panels} solar panels</span></div>
              <div class="stat"><b>${p.batteryKWh}<small style="font-size:.5em">kWh</small></b><span>Lithium storage</span></div>
              <div class="stat"><b>${EW.fmt(p.pvKW * EW.K.PSH * EW.K.PV_DERATE, 0)}<small style="font-size:.5em">kWh</small></b><span>Daily solar yield</span></div>
            </div>
          </div>
          <div>
            <h2 class="h3" style="margin-bottom:16px">What's included</h2>
            <div class="includes">${p.includes.map(x => `<div class="include"><span class="ic">${I(x.ic)}</span><b>${x.name}</b><p>${x.desc}</p><span class="w">${x.w}</span></div>`).join('')}</div>
          </div>
          <div class="grid-2">
            <div class="card"><div class="h4" style="margin-bottom:14px">What it can power</div><ul class="check-list">${p.powers.map(x => `<li>${x}</li>`).join('')}</ul></div>
            <div class="card"><div class="h4" style="margin-bottom:14px">${p.cant.length ? 'Needs an upgrade for' : 'Built for'}</div>
              ${p.cant.length ? `<ul class="check-list no">${p.cant.map(x => `<li>${x}</li>`).join('')}</ul>` : `<ul class="check-list">${p.features.map(x => `<li>${x}</li>`).join('')}</ul>`}
              <a class="link-btn mt-2" style="display:inline-block" href="#/sizer">Check your own appliances →</a></div>
          </div>
          <div class="card soft">
            <div class="h4" style="margin-bottom:10px">Key features</div>
            <div class="row" style="gap:8px">${p.features.map(f => `<span class="chip">${I('check', 'sm')} ${f}</span>`).join('')}</div>
          </div>
        </div>

        <aside class="sticky-buy stack">
          <div class="card" style="padding:24px">
            <div class="between"><span class="small">Supply &amp; installation</span><span class="stock">${p.segment === 'home' ? 'Installs in 5–7 days' : 'Site survey required'}</span></div>
            <div class="price mt-1" style="font-size:36px;letter-spacing:-.03em" data-total>${EW.money(p.price)}</div>
            <div class="small">${p.was ? `<s>${EW.money(p.was)}</s> · <span class="accent">You save ${EW.money(p.was - p.price)}</span> · ` : ''}Price includes installation within 30km of Harare</div>
            <hr class="divider" style="margin:18px 0">
            <div class="h4" style="font-size:15px;margin-bottom:10px">Customise your system</div>
            <div class="stack-sm" data-addons>
              ${EW.addons.map(a => `<label class="addon"><input type="checkbox" value="${a.id}"><span class="t">${a.name}<small>${a.note}</small></span><span class="p">+${EW.money(a.price)}</span></label>`).join('')}
            </div>
            <hr class="divider" style="margin:18px 0">
            <div class="h4" style="font-size:15px;margin-bottom:10px">Payment option</div>
            <div class="seg" data-payopt style="width:100%;display:grid;grid-template-columns:repeat(3,1fr)">
              <button class="on" data-v="full">Full</button><button data-v="deposit">20% deposit</button><button data-v="finance">Monthly</button>
            </div>
            <div class="small mt-1" data-payinfo></div>
            <div class="stack-sm mt-2">
              <button class="btn btn-dark btn-lg btn-block" data-add>${I('bag', 'sm')} Add to cart</button>
              <button class="btn btn-green btn-lg btn-block" data-buy>Buy now ${I('arrowR', 'sm arrow')}</button>
            </div>
            <div class="row mt-2" style="justify-content:center;gap:6px">
              <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${EW.waLink(`Hi EcoWealth, I'm interested in the ${p.full} (${EW.money(p.price)}). Please send me a quote.`)}">${I('whatsapp', 'sm')} WhatsApp</a>
              <button class="btn btn-ghost btn-sm" data-brochure>${I('print', 'sm')} Brochure</button>
              <button class="btn btn-ghost btn-sm" data-share>${I('share', 'sm')} Share</button>
            </div>
          </div>
          <div class="card soft stack-sm">
            <div class="row small" style="gap:10px">${I('shield', 'sm')} Warranties up to 25 years, backed by EcoWealth</div>
            <div class="row small" style="gap:10px">${I('truck', 'sm')} Delivery &amp; installation nationwide</div>
            <div class="row small" style="gap:10px">${I('wifi', 'sm')} 24/7 remote monitoring included</div>
          </div>
        </aside>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="sec-head"><h2 class="h2">Other packages to consider</h2><a class="btn btn-outline" href="#/packages">All packages</a></div>
        <div class="cards-3">${rel.map(x => EW.pkgCard(x)).join('')}</div>
      </div>
    </section>`;
  };

  EW.views.packageDetail.mount = (root, { slug }) => {
    const p = EW.packages.find(x => x.slug === slug); if (!p) return;
    EW.$$('[data-g]', root).forEach(b => b.onclick = () => { EW.$('[data-main]', root).src = EW.img(b.dataset.g); EW.$$('[data-g]', root).forEach(x => x.classList.toggle('on', x === b)); });
    let pay = 'full';
    const addons = () => EW.$$('[data-addons] input:checked', root).map(x => x.value);
    const total = () => p.price + EW.addons.filter(a => addons().includes(a.id)).reduce((s, a) => s + a.price, 0);
    const upd = () => {
      const t = total();
      EW.$('[data-total]', root).textContent = EW.money(t);
      EW.$('[data-payinfo]', root).innerHTML = pay === 'full' ? 'Pay in full at checkout: EcoCash, card, ZimSwitch or bank transfer.'
        : pay === 'deposit' ? `Pay <b>${EW.money(Math.round(t * 0.2))}</b> now to book your installation. Pay the ${EW.money(t - Math.round(t * 0.2))} balance on commissioning day.`
          : `From <b>${EW.money(Math.round(t / 6))}/mo</b> over 6 months at 0%, or ${EW.money(Math.round(t * 1.1 / 24))}/mo over 24 months. <a href="#/financing?amt=${t}" style="text-decoration:underline">Calculate</a>`;
    };
    EW.$$('[data-addons] input', root).forEach(x => x.onchange = upd);
    EW.$$('[data-payopt] button', root).forEach(b => b.onclick = () => { pay = b.dataset.v; EW.$$('[data-payopt] button', root).forEach(x => x.classList.toggle('on', x === b)); upd(); });
    upd();
    EW.$('[data-add]', root).onclick = () => S.addPackage(p.slug, addons());
    EW.$('[data-buy]', root).onclick = () => { S.addPackage(p.slug, addons(), { silent: true }); EW.go('/checkout' + (pay !== 'full' ? '?pay=' + pay : '')); };
    EW.$('[data-brochure]', root).onclick = () => EW.brochure(p);
    EW.$('[data-share]', root).onclick = () => EW.share(p.full, location.href);
  };

  EW.share = async (title, url) => {
    try { if (navigator.share) { await navigator.share({ title, url }); return; } } catch (e) { return; }
    try { await navigator.clipboard.writeText(url); EW.toast('Link copied to clipboard'); } catch (e) { EW.toast('Copy this link: ' + EW.esc(url)); }
  };

  EW.brochure = p => {
    const box = EW.openModal(`
      <div class="brochure" style="padding:clamp(20px,4vw,40px)">
        <div class="between" style="margin-bottom:20px"><img src="assets/brand/logo.png" alt="EcoWealth" style="height:28px"><span class="tiny">Package brochure · ${new Date().toLocaleDateString('en-GB')}</span></div>
        <div style="border-radius:18px;overflow:hidden;position:relative;height:220px"><img src="${EW.img(p.img)}" style="width:100%;height:100%;object-fit:cover" alt="">
          <div style="position:absolute;left:20px;bottom:18px;color:#fff"><div class="h2">${p.full}</div><div>${p.blurb}</div></div></div>
        <div class="stats" style="margin-top:24px;padding-bottom:20px">
          <div class="stat"><b>${p.kva}kVA</b><span>Inverter</span></div><div class="stat"><b>${p.pvKW}kWp</b><span>${p.panels} panels</span></div>
          <div class="stat"><b>${p.batteryKWh}kWh</b><span>Storage</span></div><div class="stat"><b>${EW.money(p.price)}</b><span>Installed price</span></div></div>
        <div class="grid-2 mt-3">
          <div><div class="h4" style="margin-bottom:10px">What's included</div><ul class="check-list">${p.includes.map(x => `<li><span><b>${x.name}</b> — ${x.desc} <span class="tiny">(${x.w})</span></span></li>`).join('')}</ul></div>
          <div><div class="h4" style="margin-bottom:10px">What it can power</div><ul class="check-list">${p.powers.map(x => `<li>${x}</li>`).join('')}</ul></div>
        </div>
        <p class="tiny mt-3">Final pricing is confirmed after a free site survey and depends on delivery location. Tier-1 components only · 12-month workmanship warranty · ${EW.company.phone} · ${EW.company.email}</p>
        <div class="row mt-2 no-print"><button class="btn btn-dark" onclick="window.print()">${I('print', 'sm')} Print / Save as PDF</button></div>
      </div>`);
    box.classList.add('print-area');
  };

  /* ---------------- financing ---------------- */
  EW.views.financing = () => `
    <section class="page-hero">
      <div class="bg"><img src="${EW.img('panels-sky')}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <span>Financing</span></div>
        <h1 class="h1">Solar you can <span class="accent">pay for monthly</span></h1>
        <p>EcoWealth helps homes and businesses across Zimbabwe get started with solar financing. Choose a term that suits your budget.</p>
      </div>
    </section>
    <section class="section">
      <div class="container fin">
        <div class="card stack" style="padding:28px">
          <div class="field"><label>Choose a package, or enter an amount</label>
            <select class="select" data-pk><option value="">Custom amount</option>${EW.packages.map(p => `<option value="${p.price}">${p.full} — ${EW.money(p.price)}</option>`).join('')}</select></div>
          <div class="field"><label>System cost <b class="num" data-amt-out style="float:right"></b></label><input type="range" min="500" max="35000" step="50" data-amt></div>
          <div class="field"><label>Deposit <b class="num" data-dep-out style="float:right"></b></label><input type="range" min="0" max="50" step="5" value="20" data-dep></div>
          <div class="field"><label>Repayment term</label>
            <div class="tiles" data-plans style="grid-template-columns:repeat(3,1fr)">${EW.financing.map((f, k) => `<button class="tile ${k === 1 ? 'on' : ''}" data-id="${f.id}"><b>${f.label}</b><span>${f.rate ? (f.rate * 100) + '% flat' : '0% interest'}</span><span class="chip green" style="justify-self:start;margin-top:4px">${f.badge}</span></button>`).join('')}</div></div>
        </div>
        <div class="out" data-out></div>
      </div>
      <div class="container mt-4">
        <div class="process three">
          ${[['Apply in minutes', 'ID, proof of residence and 3 months of bank statements or payslips.'], ['Approval in 48 hrs', 'We assess and approve most applications within two working days.'], ['Install & pay monthly', 'Pay your deposit and we install. Monthly payments by EcoCash debit order or bank transfer.']].map(([t, d]) => `<div class="card soft"><div class="h4">${t}</div><p class="small" style="margin:8px 0 0">${d}</p></div>`).join('')}
        </div>
        <p class="tiny mt-2">Illustrative terms for the demo. Final terms are subject to EcoWealth's credit assessment.</p>
      </div>
    </section>`;

  EW.views.financing.mount = (root, params) => {
    const st = { amt: +(params.amt || 3450), dep: 20, plan: 'f12' };
    const amt = EW.$('[data-amt]', root); amt.value = st.amt;
    const draw = () => {
      const f = EW.financing.find(x => x.id === st.plan);
      const deposit = Math.round(st.amt * st.dep / 100), fin = st.amt - deposit;
      const interest = fin * f.rate, monthly = (fin + interest) / f.months;
      EW.$('[data-amt-out]', root).textContent = EW.money(st.amt);
      EW.$('[data-dep-out]', root).textContent = `${st.dep}% · ${EW.money(deposit)}`;
      EW.$('[data-out]', root).innerHTML = `
        <span class="tiny" style="color:rgba(255,255,255,.6)">Your monthly payment</span>
        <div class="big">${EW.money(monthly, true)}</div>
        <div class="tiny" style="color:rgba(255,255,255,.6)">for ${f.months} months</div>
        <div class="progress" style="background:rgba(255,255,255,.12)"><i style="width:${st.dep}%"></i></div>
        <div class="row"><span>Deposit today</span><b>${EW.money(deposit)}</b></div>
        <div class="row"><span>Amount financed</span><b>${EW.money(fin)}</b></div>
        <div class="row"><span>Interest (${f.rate * 100}% flat)</span><b>${EW.money(interest)}</b></div>
        <div class="row"><span>Total you pay</span><b>${EW.money(st.amt + interest)}</b></div>
        <a class="btn btn-green btn-lg btn-block mt-1" href="#/contact?topic=financing&amt=${st.amt}">Apply for financing ${I('arrowR', 'sm arrow')}</a>`;
    };
    amt.oninput = () => { st.amt = +amt.value; EW.$('[data-pk]', root).value = ''; draw(); };
    EW.$('[data-pk]', root).onchange = e => { if (e.target.value) { st.amt = +e.target.value; amt.value = st.amt; draw(); } };
    EW.$('[data-dep]', root).oninput = e => { st.dep = +e.target.value; draw(); };
    EW.$$('[data-plans] .tile', root).forEach(b => b.onclick = () => { st.plan = b.dataset.id; EW.$$('[data-plans] .tile', root).forEach(x => x.classList.toggle('on', x === b)); draw(); });
    draw();
  };
})();
