/* Shop: listing with URL-synced filters, quick view, product detail, compare, wishlist */
(function () {
  const I = EW.icon, S = EW.store;
  const PER_PAGE = 9;
  const catName = id => EW.categories.find(c => c.id === id)?.name || '';
  const pct = p => p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
  const stockHTML = p => p.stock === 0 ? '<span class="stock out">Out of stock</span>' : p.stock <= 10 ? `<span class="stock low">Only ${p.stock} left</span>` : '<span class="stock">In stock</span>';

  EW.productCard = (p, cls = '') => `
    <article class="l-card ambient-card ${cls}" data-pid="${p.id}">
      <img class="ambient-bleed" src="${EW.img(p.img, 1)}" alt="" aria-hidden="true" loading="lazy">
      <div class="media">
        <a href="#/shop/${p.id}"><img src="${EW.img(p.img, 1)}" alt="${EW.esc(p.name)}" loading="lazy"></a>
        <div class="tl">${p.was ? `<span class="chip danger">−${pct(p)}%</span>` : ''}${p.badge ? `<span class="chip glassy">${p.badge}</span>` : ''}${p.stock === 0 ? '<span class="chip dark">Sold out</span>' : ''}</div>
        <div class="tr">
          <button class="fab heart ${S.wish.includes(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-label="Save to wishlist">${I('heart', 'sm')}</button>
          <button class="fab ${S.compare.includes(p.id) ? 'on' : ''}" data-cmp="${p.id}" aria-label="Compare">${I('compare', 'sm')}</button>
          <button class="fab" data-quick="${p.id}" aria-label="Quick view">${I('eye', 'sm')}</button>
        </div>
      </div>
      <div class="body">
        <div class="between"><span class="tiny">${p.brand} · ${catName(p.cat)}</span><span class="rating"><span class="stars">★</span>${p.rating} (${p.reviews})</span></div>
        <a href="#/shop/${p.id}"><h3 class="title" style="font-size:15.5px">${p.name}</h3></a>
        <div class="specs">${Object.values(p.specs).slice(0, 2).map(v => `<span>${v}</span>`).join('')}</div>
        ${stockHTML(p)}
        <div class="foot">
          <div class="price">${EW.money(p.price)}${p.was ? `<s>${EW.money(p.was)}</s>` : ''}</div>
          <button class="btn btn-lime btn-sm" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${I('plus', 'sm')} Add</button>
        </div>
      </div>
    </article>`;

  // global delegated handlers for product cards (works on every page)
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-wish],[data-cmp],[data-quick]');
    if (!t || t.closest('[data-no-deleg]')) return;
    e.preventDefault();
    if (t.dataset.add) S.addProduct(t.dataset.add);
    if (t.dataset.wish) t.classList.toggle('on', S.toggleWish(t.dataset.wish));
    if (t.dataset.cmp) { const on = S.toggleCompare(t.dataset.cmp); EW.$$(`[data-cmp="${t.dataset.cmp}"]`).forEach(b => b.classList.toggle('on', on)); if (on) EW.toast('Added to compare', 'Compare now', () => EW.go('/compare')); }
    if (t.dataset.quick) EW.quickView(t.dataset.quick);
  });

  EW.quickView = id => {
    const p = EW.products.find(x => x.id === id);
    const box = EW.openModal(`
      <div class="pd" style="padding:clamp(18px,3vw,28px);gap:28px" data-no-deleg>
        <div class="gallery" style="position:static"><div class="main"><img src="${EW.img(p.img)}" alt=""></div></div>
        <div class="stack" style="align-content:start;padding-top:8px">
          <span class="tiny">${p.brand} · ${catName(p.cat)}</span>
          <h2 class="h3">${p.name}</h2>
          <span class="rating"><span class="stars">${EW.stars(p.rating)}</span>${p.rating} · ${p.reviews} reviews</span>
          <div class="price" style="font-size:28px">${EW.money(p.price)}${p.was ? `<s>${EW.money(p.was)}</s>` : ''}</div>
          <p class="small" style="margin:0">${p.desc}</p>
          <table class="spec-table">${Object.entries(p.specs).slice(0, 4).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>
          ${stockHTML(p)}
          <div class="row"><div class="qty"><button data-qq="-1">${I('minus', 'sm')}</button><span data-qv>1</span><button data-qq="1">${I('plus', 'sm')}</button></div>
            <button class="btn btn-dark" data-qadd ${p.stock === 0 ? 'disabled' : ''}>Add to cart</button>
            <a class="btn btn-outline" href="#/shop/${p.id}" onclick="EW.closeOverlays()">Full details</a></div>
        </div>
      </div>`);
    let q = 1;
    EW.$$('[data-qq]', box).forEach(b => b.onclick = () => { q = Math.max(1, Math.min(p.stock || 1, q + +b.dataset.qq)); EW.$('[data-qv]', box).textContent = q; });
    EW.$('[data-qadd]', box).onclick = () => { S.addProduct(p.id, q); EW.closeOverlays(); };
  };

  /* ---------------- listing ---------------- */
  EW.views.shop = () => `
    <section class="page-hero" style="padding-bottom:clamp(28px,4vw,44px)">
      <div class="bg"><img src="${EW.img('panel-closeup')}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <span>Shop</span></div>
        <h1 class="h1">The EcoWealth <span class="accent">solar shop</span></h1>
        <p>Tier-1 panels, hybrid inverters, lithium storage and solar geysers. Delivery across Zimbabwe, and free on orders over ${EW.money(EW.FREE_DELIVERY)}.</p>
      </div>
    </section>
    <section class="section-tight">
      <div class="container shop-layout">
        <aside class="filters" data-filters></aside>
        <div>
          <div class="toolbar">
            <label class="search">${I('search', 'sm')}<input type="search" placeholder="Search panels, batteries, inverters…" data-search></label>
            <div class="row" style="gap:8px">
              <button class="btn btn-outline btn-sm only-mobile" data-toggle-filters>${I('filter', 'sm')} Filters</button>
              <select class="select" data-sort style="width:auto;height:40px">
                <option value="featured">Featured</option><option value="price">Price: low to high</option><option value="-price">Price: high to low</option>
                <option value="rating">Top rated</option><option value="sale">Biggest discount</option><option value="name">Name A to Z</option></select>
              <div class="seg"><button data-view="grid" aria-label="Grid view">${I('grid', 'sm')}</button><button data-view="list" aria-label="List view">${I('list', 'sm')}</button></div>
            </div>
          </div>
          <div class="active-filters" data-active></div>
          <div class="between small" style="margin-bottom:14px" data-results></div>
          <div class="p-grid" data-grid></div>
          <div class="row mt-3" style="justify-content:center;gap:6px" data-pages></div>
        </div>
      </div>
    </section>
    <section class="section-tight">
      <div class="container"><div class="cta-band"><img src="${EW.img('engineer')}" alt="">
        <h2 class="h2">Not sure which parts you need?</h2><p>The Solar Sizer builds a matched parts list from your appliances. Or send us your list on WhatsApp.</p>
        <div class="row mt-2"><a class="btn btn-green" href="#/sizer">Open Solar Sizer</a><a class="btn btn-white" target="_blank" rel="noopener" href="${EW.waLink('Hi EcoWealth, I need help choosing solar products.')}">${I('whatsapp', 'sm')} WhatsApp us</a></div></div></div>
    </section>`;

  EW.views.shop.mount = (root, params) => {
    const f = {
      cat: params.cat || '', q: params.q || '', brand: params.brand ? params.brand.split(',') : [],
      min: +params.min || 0, max: +params.max || 0, sale: params.sale === '1', stock: params.stock === '1', rating: +params.rating || 0,
      sort: params.sort || 'featured', page: +params.page || 1, view: params.view || 'grid',
    };
    const priceMax = Math.max(...EW.products.map(p => p.price));
    const sync = () => {
      const qs = new URLSearchParams();
      if (f.cat) qs.set('cat', f.cat); if (f.q) qs.set('q', f.q); if (f.brand.length) qs.set('brand', f.brand.join(','));
      if (f.min) qs.set('min', f.min); if (f.max) qs.set('max', f.max); if (f.sale) qs.set('sale', 1); if (f.stock) qs.set('stock', 1);
      if (f.rating) qs.set('rating', f.rating); if (f.sort !== 'featured') qs.set('sort', f.sort); if (f.page > 1) qs.set('page', f.page); if (f.view !== 'grid') qs.set('view', f.view);
      EW.replace('/shop' + (qs.toString() ? '?' + qs : ''));
    };
    const base = () => EW.products.filter(p => {
      const q = f.q.toLowerCase();
      return (!q || (p.name + ' ' + p.brand + ' ' + catName(p.cat)).toLowerCase().includes(q));
    });
    const apply = (list, skip) => list.filter(p =>
      (skip === 'cat' || !f.cat || p.cat === f.cat) &&
      (skip === 'brand' || !f.brand.length || f.brand.includes(p.brand)) &&
      (!f.min || p.price >= f.min) && (!f.max || p.price <= f.max) &&
      (!f.sale || p.was) && (!f.stock || p.stock > 0) && (!f.rating || p.rating >= f.rating));

    const drawFilters = () => {
      const b = base();
      const catCounts = c => apply(b, 'cat').filter(p => !c || p.cat === c).length;
      const brands = [...new Set(apply(b, 'brand').map(p => p.brand).concat(f.brand))].sort();
      EW.$('[data-filters]', root).innerHTML = `
        <div class="filter-group"><h6>Category</h6><div class="cat-list">
          <button class="${!f.cat ? 'on' : ''}" data-cat="">All products <small>${catCounts('')}</small></button>
          ${EW.categories.map(c => `<button class="${f.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.name} <small>${catCounts(c.id)}</small></button>`).join('')}</div></div>
        <div class="filter-group"><h6>Brand</h6><div class="stack-sm">${brands.map(br => `<label class="check"><input type="checkbox" data-brand="${EW.esc(br)}" ${f.brand.includes(br) ? 'checked' : ''}> ${br} <span class="tiny" style="margin-left:auto">${apply(b, 'brand').filter(p => p.brand === br).length}</span></label>`).join('')}</div></div>
        <div class="filter-group"><h6>Price (USD)</h6>
          <div class="row" style="gap:8px;flex-wrap:nowrap"><input class="input" type="number" min="0" placeholder="Min" value="${f.min || ''}" data-min style="height:40px"><span class="tiny">to</span><input class="input" type="number" min="0" placeholder="${priceMax}" value="${f.max || ''}" data-max style="height:40px"></div>
          <div class="row mt-1" style="gap:6px">${[[0, 200], [200, 1000], [1000, 0]].map(([a, z]) => `<button class="chip" style="cursor:pointer" data-prange="${a}-${z}">${z ? `${EW.money(a)} to ${EW.money(z)}` : `${EW.money(a)}+`}</button>`).join('')}</div></div>
        <div class="filter-group"><h6>Rating</h6><div class="stack-sm">${[4.8, 4.5, 4].map(r => `<label class="check"><input type="radio" name="rating" data-rating="${r}" ${f.rating === r ? 'checked' : ''}> <span class="stars">${EW.stars(r)}</span> ${r}+</label>`).join('')}
          <label class="check"><input type="radio" name="rating" data-rating="0" ${!f.rating ? 'checked' : ''}> Any rating</label></div></div>
        <div class="stack-sm"><label class="check"><input type="checkbox" data-sale ${f.sale ? 'checked' : ''}> On sale</label><label class="check"><input type="checkbox" data-stock ${f.stock ? 'checked' : ''}> In stock only</label></div>
        <button class="btn btn-outline btn-sm" data-reset>Clear all filters</button>`;
      const fl = EW.$('[data-filters]', root);
      EW.$$('[data-cat]', fl).forEach(x => x.onclick = () => { f.cat = x.dataset.cat; f.page = 1; draw(); });
      EW.$$('[data-brand]', fl).forEach(x => x.onchange = () => { f.brand = x.checked ? [...f.brand, x.dataset.brand] : f.brand.filter(v => v !== x.dataset.brand); f.page = 1; draw(); });
      EW.$('[data-min]', fl).onchange = e => { f.min = +e.target.value || 0; f.page = 1; draw(); };
      EW.$('[data-max]', fl).onchange = e => { f.max = +e.target.value || 0; f.page = 1; draw(); };
      EW.$$('[data-prange]', fl).forEach(x => x.onclick = () => { const [a, z] = x.dataset.prange.split('-'); f.min = +a; f.max = +z; f.page = 1; draw(); });
      EW.$$('[data-rating]', fl).forEach(x => x.onchange = () => { f.rating = +x.dataset.rating; f.page = 1; draw(); });
      EW.$('[data-sale]', fl).onchange = e => { f.sale = e.target.checked; f.page = 1; draw(); };
      EW.$('[data-stock]', fl).onchange = e => { f.stock = e.target.checked; f.page = 1; draw(); };
      EW.$('[data-reset]', fl).onclick = () => { Object.assign(f, { cat: '', q: '', brand: [], min: 0, max: 0, sale: false, stock: false, rating: 0, page: 1 }); EW.$('[data-search]', root).value = ''; draw(); };
    };

    const draw = () => {
      let list = apply(base());
      const s = f.sort;
      list.sort((a, b) => s === 'price' ? a.price - b.price : s === '-price' ? b.price - a.price : s === 'rating' ? b.rating - a.rating || b.reviews - a.reviews
        : s === 'sale' ? pct(b) - pct(a) : s === 'name' ? a.name.localeCompare(b.name) : (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.reviews - a.reviews);
      const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      f.page = Math.min(f.page, pages);
      const slice = list.slice((f.page - 1) * PER_PAGE, f.page * PER_PAGE);
      const grid = EW.$('[data-grid]', root);
      grid.classList.toggle('list', f.view === 'list');
      grid.innerHTML = slice.length ? slice.map(p => EW.productCard(p)).join('') : `<div class="empty" style="grid-column:1/-1"><div class="h3">No products found</div><p>Try removing a filter or searching for something else.</p><button class="btn btn-outline" data-reset2>Clear filters</button></div>`;
      const r2 = EW.$('[data-reset2]', grid); if (r2) r2.onclick = () => EW.$('[data-reset]', root).click();
      EW.$('[data-results]', root).innerHTML = `<span><b style="color:var(--ink)">${list.length}</b> product${list.length === 1 ? '' : 's'}${f.cat ? ' in ' + catName(f.cat) : ''}</span><span>Page ${f.page} of ${pages}</span>`;
      // pagination with ellipsis
      const nums = [];
      for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - f.page) <= 1) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…');
      EW.$('[data-pages]', root).innerHTML = pages > 1 ? `<button class="icon-btn" data-pg="${f.page - 1}" ${f.page === 1 ? 'disabled style="opacity:.4"' : ''} aria-label="Previous page">${I('arrowL', 'sm')}</button>` +
        nums.map(n => n === '…' ? '<span class="small">…</span>' : `<button class="icon-btn" data-pg="${n}" style="${n === f.page ? 'background:var(--ink);color:#fff;border-color:var(--ink)' : ''}">${n}</button>`).join('') +
        `<button class="icon-btn" data-pg="${f.page + 1}" ${f.page === pages ? 'disabled style="opacity:.4"' : ''} aria-label="Next page">${I('arrowR', 'sm')}</button>` : '';
      EW.$$('[data-pg]', root).forEach(b => b.onclick = () => { f.page = +b.dataset.pg; draw(); EW.$('.toolbar', root).scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      // active chips
      const chips = [];
      if (f.cat) chips.push(['cat', catName(f.cat)]); if (f.q) chips.push(['q', `“${f.q}”`]);
      f.brand.forEach(b => chips.push(['brand:' + b, b]));
      if (f.min || f.max) chips.push(['price', `${EW.money(f.min)} to ${f.max ? EW.money(f.max) : 'any'}`]);
      if (f.rating) chips.push(['rating', `${f.rating}★+`]); if (f.sale) chips.push(['sale', 'On sale']); if (f.stock) chips.push(['stock', 'In stock']);
      EW.$('[data-active]', root).innerHTML = chips.map(([k, t]) => `<span class="chip green">${EW.esc(t)} <button data-rm="${EW.esc(k)}" aria-label="Remove filter">${I('x', 'sm')}</button></span>`).join('');
      EW.$$('[data-rm]', root).forEach(b => b.onclick = () => {
        const k = b.dataset.rm;
        if (k === 'cat') f.cat = ''; else if (k === 'q') { f.q = ''; EW.$('[data-search]', root).value = ''; } else if (k.startsWith('brand:')) f.brand = f.brand.filter(x => x !== k.slice(6));
        else if (k === 'price') { f.min = 0; f.max = 0; } else f[k] = k === 'rating' ? 0 : false;
        f.page = 1; draw();
      });
      EW.$$('[data-view]', root).forEach(b => b.classList.toggle('on', b.dataset.view === f.view));
      drawFilters(); sync(); EW.renderCompareBar();
    };

    const s = EW.$('[data-search]', root); s.value = f.q;
    let t; s.oninput = () => { clearTimeout(t); t = setTimeout(() => { f.q = s.value.trim(); f.page = 1; draw(); }, 250); };
    EW.$('[data-sort]', root).value = f.sort;
    EW.$('[data-sort]', root).onchange = e => { f.sort = e.target.value; draw(); };
    EW.$$('[data-view]', root).forEach(b => b.onclick = () => { f.view = b.dataset.view; draw(); });
    EW.$('[data-toggle-filters]', root).onclick = () => EW.$('[data-filters]', root).classList.toggle('open');
    draw();
  };

  /* ---------------- product detail ---------------- */
  EW.views.product = ({ id }) => {
    const p = EW.products.find(x => x.id === id);
    if (!p) return EW.views.notFound();
    const similar = EW.products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
    const fbt = (p.cat === 'panels' ? ['mount-ibr', 'pv-cable'] : p.cat === 'inverters' ? ['pylon-us5000', 'combiner'] : p.cat === 'batteries' ? ['deye-5', 'pv-cable'] : ['ja-550', 'combiner'])
      .map(i => EW.products.find(x => x.id === i)).filter(x => x && x.id !== p.id);
    const dist = [.72, .18, .06, .03, .01];
    return `
    <section style="padding-top:calc(env(safe-area-inset-top,0px) + 96px)" class="section-tight">
      <div class="container">
        <div class="crumbs dark"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / <a href="#/shop?cat=${p.cat}">${catName(p.cat)}</a> / <span>${p.brand}</span></div>
        <div class="pd mt-2">
          <div class="gallery">
            <div class="main" data-zoom><img src="${EW.img(p.imgs[0])}" alt="${EW.esc(p.name)}" data-main>
              <div style="position:absolute;left:14px;top:14px;display:flex;gap:6px">${p.was ? `<span class="chip danger">−${pct(p)}%</span>` : ''}${p.badge ? `<span class="chip glassy">${p.badge}</span>` : ''}</div>
              <span class="chip glassy" style="position:absolute;right:14px;bottom:14px">${I('zoom', 'sm')} Hover to zoom</span></div>
            <div class="thumbs">${p.imgs.map((g, k) => `<button class="${k ? '' : 'on'}" data-g="${g}"><img src="${EW.img(g, 1)}" alt=""></button>`).join('')}</div>
          </div>
          <div class="stack">
            <a class="chip" href="#/shop?brand=${encodeURIComponent(p.brand)}" style="justify-self:start">${p.brand}</a>
            <h1 class="h2">${p.name}</h1>
            <div class="row"><span class="rating"><span class="stars">${EW.stars(p.rating)}</span><b style="color:var(--ink)">${p.rating}</b> · ${p.reviews} reviews</span>${stockHTML(p)}</div>
            <div class="row" style="align-items:baseline"><span class="price" style="font-size:36px;letter-spacing:-.03em">${EW.money(p.price)}</span>${p.was ? `<s class="small">${EW.money(p.was)}</s><span class="chip green">Save ${EW.money(p.was - p.price)}</span>` : ''}</div>
            <p class="lead" style="margin:0">${p.desc}</p>
            <div class="card soft stack-sm" style="padding:16px">
              ${Object.entries(p.specs).slice(0, 3).map(([k, v]) => `<div class="between small"><span>${k}</span><b style="color:var(--ink);font-weight:500">${v}</b></div>`).join('')}
            </div>
            <div class="row">
              <div class="qty" style="height:48px"><button data-q="-1" aria-label="Decrease">${I('minus', 'sm')}</button><span data-qv>1</span><button data-q="1" aria-label="Increase">${I('plus', 'sm')}</button></div>
              <button class="btn btn-dark btn-lg" style="flex:1" data-addp ${p.stock === 0 ? 'disabled' : ''}>${I('bag', 'sm')} Add to cart</button>
              <button class="btn btn-green btn-lg" data-buyp ${p.stock === 0 ? 'disabled' : ''}>Buy now</button>
            </div>
            <div class="row" style="gap:6px">
              <button class="btn btn-ghost btn-sm" data-wishp>${I('heart', 'sm')} <span>${S.wish.includes(p.id) ? 'Saved' : 'Save'}</span></button>
              <button class="btn btn-ghost btn-sm" data-cmpp>${I('compare', 'sm')} Compare</button>
              <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${EW.waLink(`Hi EcoWealth, is the ${p.name} (${EW.money(p.price)}) available?`)}">${I('whatsapp', 'sm')} Enquire</a>
              <button class="btn btn-ghost btn-sm" data-sharep>${I('share', 'sm')} Share</button>
            </div>
            <div class="grid-2" style="gap:10px">
              <div class="row small" style="gap:8px">${I('shield', 'sm')} ${p.specs.Warranty || 'Manufacturer warranty'}</div>
              <div class="row small" style="gap:8px">${I('truck', 'sm')} Delivery in 1 to 3 days (Harare)</div>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div class="tabs" data-tabs>${['Specifications', `Reviews (${p.reviews})`, 'Delivery & returns'].map((t, k) => `<button class="${k ? '' : 'on'}" data-tab="${k}">${t}</button>`).join('')}</div>
          <div data-pane="0"><div class="table-wrap" style="max-width:760px"><table class="spec-table">${Object.entries(p.specs).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}<tr><th>Brand</th><td>${p.brand}</td></tr><tr><th>SKU</th><td>EW-${p.id.toUpperCase()}</td></tr></table></div></div>
          <div data-pane="1" hidden>
            <div class="grid-2" style="grid-template-columns:260px 1fr;gap:40px">
              <div><div class="h1">${p.rating}</div><div class="stars" style="font-size:18px">${EW.stars(p.rating)}</div><div class="small">${p.reviews} verified reviews</div>
                <div class="stack-sm mt-2">${dist.map((d, k) => `<div class="bar-row"><span>${5 - k} star</span><div class="progress"><i style="width:${d * 100}%"></i></div><span>${Math.round(d * p.reviews)}</span></div>`).join('')}</div></div>
              <div class="stack">${[['Tawanda C.', 'Installed three months ago and running perfectly. It handles our load-shedding without trouble.', 5], ['Rudo M.', 'Quick delivery to Ruwa and the EcoWealth team helped me set up the app.', 5], ['Kuda P.', 'Great value for the price. The packaging could be better, but the product works.', 4]].map(([n, t, r]) => `<div class="card"><div class="between"><b style="font-weight:500">${n}</b><span class="stars">${EW.stars(r)}</span></div><p class="small" style="margin:8px 0 0">${t}</p></div>`).join('')}
                <p class="tiny">Sample reviews for the demo.</p></div>
            </div>
          </div>
          <div data-pane="2" hidden><div class="stack" style="max-width:760px">
            <p class="small" style="margin:0">Harare deliveries arrive in 1 to 3 working days, and other provinces in 3 to 5. The fee is $5 plus $0.65/km from our Harare warehouse. Orders over ${EW.money(EW.FREE_DELIVERY)} ship free.</p>
            <p class="small" style="margin:0">Unused items in their original packaging can be returned within 14 days. Warranty claims are handled locally by EcoWealth. You don't need to ship anything overseas.</p></div></div>
        </div>

        ${fbt.length ? `
        <div class="mt-4 card" style="padding:24px">
          <div class="h4" style="margin-bottom:16px">Frequently bought together</div>
          <div class="row" style="gap:16px;align-items:center">
            ${[p, ...fbt].map((x, k) => `${k ? '<span class="h3" style="color:var(--muted-2)">+</span>' : ''}<label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" data-fbt="${x.id}" data-price="${x.price}" checked ${k ? '' : 'disabled'} style="accent-color:var(--green);width:18px;height:18px"><img src="${EW.img(x.img, 1)}" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover"><span style="max-width:170px"><span class="small" style="color:var(--ink);display:block;line-height:1.3">${x.name}</span><b>${EW.money(x.price)}</b></span></label>`).join('')}
            <div style="margin-left:auto;text-align:right"><div class="small">Bundle total</div><div class="price" data-fbt-total></div><button class="btn btn-green btn-sm mt-1" data-fbt-add>Add selected to cart</button></div>
          </div>
        </div>` : ''}

        ${similar.length ? `<div class="mt-4"><div class="sec-head" style="margin-bottom:20px"><h2 class="h3">Similar products</h2><a class="btn btn-outline btn-sm" href="#/shop?cat=${p.cat}">View all ${catName(p.cat)}</a></div>
          <div class="cards-3">${similar.map(x => EW.productCard(x)).join('')}</div></div>` : ''}
      </div>
    </section>`;
  };

  EW.views.product.mount = (root, { id }) => {
    const p = EW.products.find(x => x.id === id); if (!p) return;
    let q = 1;
    const main = EW.$('[data-main]', root), zoom = EW.$('[data-zoom]', root);
    EW.$$('[data-g]', root).forEach(b => b.onclick = () => { main.src = EW.img(b.dataset.g); EW.$$('[data-g]', root).forEach(x => x.classList.toggle('on', x === b)); });
    zoom.onmousemove = e => { const r = zoom.getBoundingClientRect(); main.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; zoom.classList.add('zoom'); };
    zoom.onmouseleave = () => zoom.classList.remove('zoom');
    EW.$$('[data-q]', root).forEach(b => b.onclick = () => { q = Math.max(1, Math.min(p.stock || 1, q + +b.dataset.q)); EW.$('[data-qv]', root).textContent = q; });
    EW.$('[data-addp]', root).onclick = () => S.addProduct(p.id, q);
    EW.$('[data-buyp]', root).onclick = () => { S.addProduct(p.id, q, true); EW.go('/checkout'); };
    EW.$('[data-wishp]', root).onclick = e => { const on = S.toggleWish(p.id); e.currentTarget.querySelector('span').textContent = on ? 'Saved' : 'Save'; };
    EW.$('[data-cmpp]', root).onclick = () => { if (!S.compare.includes(p.id)) S.toggleCompare(p.id); EW.go('/compare'); };
    EW.$('[data-sharep]', root).onclick = () => EW.share(p.name, location.href);
    EW.$$('[data-tab]', root).forEach(b => b.onclick = () => { EW.$$('[data-tab]', root).forEach(x => x.classList.toggle('on', x === b)); EW.$$('[data-pane]', root).forEach(x => x.hidden = x.dataset.pane !== b.dataset.tab); });
    const fb = EW.$$('[data-fbt]', root);
    if (fb.length) {
      const upd = () => EW.$('[data-fbt-total]', root).textContent = EW.money(fb.filter(x => x.checked).reduce((a, x) => a + +x.dataset.price, 0));
      fb.forEach(x => x.onchange = upd); upd();
      EW.$('[data-fbt-add]', root).onclick = () => { fb.filter(x => x.checked).forEach(x => S.addProduct(x.dataset.fbt, 1, true)); EW.toast('Bundle added to cart', 'View cart', EW.openCart); };
    }
  };

  /* ---------------- compare ---------------- */
  EW.views.compare = () => {
    const ps = S.compare.map(id => EW.products.find(p => p.id === id)).filter(Boolean);
    const keys = [...new Set(ps.flatMap(p => Object.keys(p.specs)))];
    const rows = [['Price', p => EW.money(p.price)], ['Rating', p => `${p.rating} ★ (${p.reviews})`], ['Brand', p => p.brand], ['Category', p => catName(p.cat)], ['Availability', p => p.stock ? `${p.stock} in stock` : 'Out of stock'], ...keys.map(k => [k, p => p.specs[k] || 'Not listed'])];
    return `
    <section style="padding-top:calc(env(safe-area-inset-top,0px) + 110px)" class="section-tight">
      <div class="container">
        <div class="crumbs dark"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / <span>Compare</span></div>
        <div class="between mt-1" style="margin-bottom:24px"><h1 class="h2">Compare products</h1>${ps.length ? '<button class="btn btn-outline btn-sm" data-clear-cmp>Clear all</button>' : ''}</div>
        ${ps.length < 1 ? `<div class="empty"><div class="h3">Nothing to compare yet</div><p>Tap the compare icon on any product (up to 4).</p><a class="btn btn-dark" href="#/shop">Browse shop</a></div>` : `
        <div class="table-wrap"><table class="cmp">
          <thead><tr><th></th>${ps.map(p => `<th style="min-width:200px"><div class="ph"><img src="${EW.img(p.img, 1)}" alt=""></div><a href="#/shop/${p.id}" class="h4" style="font-size:15px;display:block">${p.name}</a>
            <div class="row mt-1" style="gap:6px"><button class="btn btn-lime btn-xs" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>Add to cart</button><button class="btn btn-ghost btn-xs" data-uncmp="${p.id}">Remove</button></div></th>`).join('')}</tr></thead>
          <tbody>${rows.map(([lab, f]) => { const vals = ps.map(f); const diff = new Set(vals).size > 1; return `<tr style="${diff ? 'background:#fbfdf8' : ''}"><th>${lab}${diff ? ' <span class="chip green" style="padding:2px 6px;font-size:10px">differs</span>' : ''}</th>${vals.map(v => `<td>${v}</td>`).join('')}</tr>`; }).join('')}</tbody>
        </table></div>
        ${ps.length < 4 ? `<a class="btn btn-outline mt-2" href="#/shop">${I('plus', 'sm')} Add another product</a>` : ''}`}
      </div>
    </section>`;
  };
  EW.views.compare.mount = root => {
    EW.$$('[data-uncmp]', root).forEach(b => b.onclick = () => { S.toggleCompare(b.dataset.uncmp); EW.rerender(); });
    const c = EW.$('[data-clear-cmp]', root); if (c) c.onclick = () => { S.compare = []; S.save(); EW.rerender(); };
  };

  /* ---------------- wishlist ---------------- */
  EW.views.wishlist = () => {
    const ps = S.wish.map(id => EW.products.find(p => p.id === id)).filter(Boolean);
    return `
    <section style="padding-top:calc(env(safe-area-inset-top,0px) + 110px)" class="section-tight">
      <div class="container">
        <div class="crumbs dark"><a href="#/">Home</a> / <span>Wishlist</span></div>
        <div class="between mt-1" style="margin-bottom:24px"><h1 class="h2">Your wishlist <span class="soft">(${ps.length})</span></h1>
          ${ps.length ? '<button class="btn btn-dark btn-sm" data-all>Move all to cart</button>' : ''}</div>
        ${ps.length ? `<div class="cards-4">${ps.map(p => EW.productCard(p)).join('')}</div>` : `<div class="empty"><div class="h3">Your wishlist is empty</div><p>Tap the heart on any product to save it for later.</p><a class="btn btn-dark" href="#/shop">Browse shop</a></div>`}
      </div>
    </section>`;
  };
  EW.views.wishlist.mount = root => {
    const all = EW.$('[data-all]', root);
    if (all) all.onclick = () => { S.wish.forEach(id => { const p = EW.products.find(x => x.id === id); if (p?.stock) S.addProduct(id, 1, true); }); S.wish = S.wish.filter(id => !EW.products.find(x => x.id === id)?.stock); S.save(); EW.toast('Moved to cart', 'View cart', EW.openCart); EW.rerender(); };
    if (!EW._wishWatch) { EW._wishWatch = 1; S.on(() => { if (location.hash.startsWith('#/wishlist') && EW.$$('#app .l-card').length !== S.wish.length) EW.rerender(); }); }
  };
})();
