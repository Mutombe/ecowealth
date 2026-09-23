/* Shared UI: icons, formatting, persistent store, header/footer, drawer, modal, toasts */
(function () {
  EW.views = EW.views || {};
  const P = {
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowD: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    arrowUR: '<path d="M7 17L17 7M8 7h9v9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    cart: '<path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.5L21 8H6.2"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17.5" cy="20" r="1.3"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
    heart: '<path d="M12 20s-7-4.4-9.2-8.6C1.2 8.3 3 4.5 6.6 4.5c2.1 0 3.4 1.2 4.1 2.4h2.6c.7-1.2 2-2.4 4.1-2.4 3.6 0 5.4 3.8 3.8 6.9C19 15.6 12 20 12 20z" transform="translate(0 -.5)"/>',
    compare: '<path d="M8 3v18M16 3v18M3 8h5M16 16h5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 01-2-2l.8-1-1-2L9 9.5z"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 00-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
    wallet: '<path d="M4 7a2 2 0 012-2h11v4"/><rect x="4" y="7" width="17" height="12" rx="2"/><circle cx="16.5" cy="13" r="1.2"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
    phoneSm: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>',
    battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M7 10v4M10.5 10v4"/>',
    panel: '<path d="M4 5h16l-2 10H6L4 5zM9.5 5l-1 10M14.5 5l1 10M5 10h14M12 15v4M8 19h8"/>',
    tool: '<path d="M14.7 6.3a4 4 0 00-5 5L4 17l3 3 5.7-5.7a4 4 0 005-5l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5z"/>',
    wifi: '<path d="M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l7-7"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    fridge: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M9 6v2M9 13v3"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    bed: '<path d="M3 18V7M3 13h18v5M21 13a3 3 0 00-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.5"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>',
    laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 19h18"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
    cup: '<path d="M5 8h11v6a5 5 0 01-5 5H10a5 5 0 01-5-5V8zM16 10h2a2 2 0 010 4h-2M8 3v2M11 3v2"/>',
    box: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M15 6v12M18 10v.01M18 13v.01"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-4 2.5-5 .3 1.5 1 2.5 2 3 0-3 0-5.5.5-8z"/>',
    speaker: '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="14" r="3"/><path d="M12 7h.01"/>',
    game: '<path d="M6 8h12a4 4 0 014 4v1a4 4 0 01-7 2.6h-6A4 4 0 012 13v-1a4 4 0 014-4z"/><path d="M7 11v3M5.5 12.5h3M16 12h.01M18 13.5h.01"/>',
    wind: '<path d="M3 8h11a3 3 0 10-3-3M3 12h16a3 3 0 11-3 3M3 16h7"/>',
    phone2: '<rect x="7" y="3" width="10" height="18" rx="2"/>',
    wash: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="4.5"/><path d="M7 6h.01M10 6h.01"/>',
    iron: '<path d="M3 17h15a3 3 0 003-3V9h-9a8 8 0 00-8 7v1zM12 9V6h6"/>',
    gate: '<path d="M4 20V5M20 20V5M4 8h16M4 14h16M8 8v12M12 8v12M16 8v12"/>',
    cam: '<path d="M3 8l12-3 2 6-12 3-2-6zM9 13l1 5h4M17 9l3-1"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z"/>',
    star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9L12 3z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v4M12 17h.01"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    refresh: '<path d="M20 11a8 8 0 00-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0014.5 4.5L20 16M20 20v-4h-4"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8" r="1.3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M18 14c2 .8 3.5 3 3.5 6"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8 11h6M11 8v6"/>',
  };
  EW.icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.info}</svg>`;

  EW.money = (n, cents) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  EW.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  EW.stars = r => { const f = Math.round(r); return '★★★★★'.slice(0, f) + '☆☆☆☆☆'.slice(0, 5 - f); };
  EW.$ = (s, r = document) => r.querySelector(s);
  EW.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  EW.fmt = (n, d = 1) => Number(n).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });

  /* ---------------- persistent store ---------------- */
  const KEY = 'ecowealth-store-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const saved = load();
  const S = EW.store = {
    cart: saved.cart || [],          // { key, type: 'product'|'package'|'kit', id, qty, price, name, img, meta }
    wish: saved.wish || [],          // product / package ids
    compare: saved.compare || [],    // product ids (max 4)
    orders: saved.orders || [],
    zone: saved.zone || 'hre-n',
    coupon: saved.coupon || null,
    sizer: saved.sizer || null,
    listeners: [],
  };
  S.save = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ cart: S.cart, wish: S.wish, compare: S.compare, orders: S.orders, zone: S.zone, coupon: S.coupon, sizer: S.sizer })); } catch (e) { }
    S.listeners.forEach(f => f());
    EW.updateBadges();
  };
  S.on = f => S.listeners.push(f);
  S.count = () => S.cart.reduce((a, l) => a + l.qty, 0);
  S.subtotal = () => S.cart.reduce((a, l) => a + l.price * l.qty, 0);
  S.savings = () => S.cart.reduce((a, l) => a + ((l.was || l.price) - l.price) * l.qty, 0);
  S.discount = () => (S.coupon && EW.coupons[S.coupon] ? Math.round(S.subtotal() * EW.coupons[S.coupon].pct / 100) : 0);
  S.delivery = () => {
    const z = EW.zones.find(z => z.id === S.zone) || EW.zones[1];
    if (z.km === 0 || S.subtotal() >= EW.FREE_DELIVERY) return 0;
    return EW.deliveryFee(z.km);
  };
  S.total = () => Math.max(0, S.subtotal() - S.discount() + S.delivery());

  S.addProduct = (id, qty = 1, silent) => {
    const p = EW.products.find(x => x.id === id);
    if (!p || p.stock === 0) return;
    const key = 'p:' + id;
    const l = S.cart.find(x => x.key === key);
    if (l) l.qty = Math.min(l.qty + qty, p.stock);
    else S.cart.push({ key, type: 'product', id, qty: Math.min(qty, p.stock), price: p.price, was: p.was, name: p.name, img: p.img, meta: p.brand });
    S.save();
    if (!silent) EW.toast(`Added to cart: <b>${EW.esc(p.name)}</b>`, 'View cart', () => EW.openCart());
  };
  S.addPackage = (slug, addons = [], opts = {}) => {
    const p = EW.packages.find(x => x.slug === slug);
    if (!p) return;
    const ad = EW.addons.filter(a => addons.includes(a.id));
    const price = p.price + ad.reduce((a, x) => a + x.price, 0);
    const key = 'k:' + slug + ':' + addons.sort().join(',');
    const l = S.cart.find(x => x.key === key);
    if (l) l.qty += 1;
    else S.cart.push({ key, type: 'package', id: slug, qty: 1, price, was: p.was ? p.was + (price - p.price) : null, name: p.full + ' — installed', img: p.img, meta: ad.length ? '+ ' + ad.map(a => a.name).join(', ') : 'Supply & installation', addons });
    S.save();
    if (!opts.silent) EW.toast(`Added <b>${EW.esc(p.full)}</b> to cart`, 'View cart', () => EW.openCart());
  };
  S.setQty = (key, q) => {
    const l = S.cart.find(x => x.key === key); if (!l) return;
    const max = l.type === 'product' ? (EW.products.find(p => p.id === l.id)?.stock || 99) : 10;
    l.qty = Math.max(1, Math.min(q, max)); S.save();
  };
  S.remove = key => { S.cart = S.cart.filter(x => x.key !== key); S.save(); };
  S.toggleWish = id => {
    const on = S.wish.includes(id);
    S.wish = on ? S.wish.filter(x => x !== id) : [...S.wish, id];
    S.save();
    EW.toast(on ? 'Removed from wishlist' : 'Saved to wishlist', on ? null : 'View', () => EW.go('/wishlist'));
    return !on;
  };
  S.toggleCompare = id => {
    const on = S.compare.includes(id);
    if (!on && S.compare.length >= 4) { EW.toast('You can compare up to 4 products'); return false; }
    S.compare = on ? S.compare.filter(x => x !== id) : [...S.compare, id];
    S.save(); EW.renderCompareBar();
    return !on;
  };

  /* ---------------- toasts ---------------- */
  EW.toast = (html, action, fn) => {
    const box = EW.$('#toasts');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="ok">${EW.icon('check', 'sm')}</span><span>${html}</span>${action ? `<a href="#" role="button">${action}</a>` : ''}`;
    if (action) t.querySelector('a').onclick = e => { e.preventDefault(); fn && fn(); t.remove(); };
    box.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 3200);
    while (box.children.length > 3) box.firstChild.remove();
  };

  /* ---------------- header / footer ---------------- */
  const NAV = [['/', 'Home'], ['/sizer', 'Solar Sizer'], ['/packages', 'Packages'], ['/shop', 'Shop'], ['/projects', 'Projects'], ['/about', 'About'], ['/contact', 'Contact']];
  EW.renderHeader = () => {
    EW.$('#header').innerHTML = `
      <div class="container nav-row">
        <a class="brand" href="#/" aria-label="EcoWealth home">
          <img class="logo-white" src="assets/brand/logo-white.png" alt="EcoWealth">
          <img class="logo-color" src="assets/brand/logo.png" alt="EcoWealth">
        </a>
        <nav class="nav-pill" aria-label="Main">${NAV.map(([h, t]) => `<a href="#${h}" data-nav="${h}">${t}</a>`).join('')}</nav>
        <div class="nav-actions">
          <a class="icon-btn" href="#/wishlist" aria-label="Wishlist">${EW.icon('heart')}<span class="badge" data-badge="wish" hidden></span></a>
          <button class="icon-btn" data-open-cart aria-label="Cart">${EW.icon('bag')}<span class="badge" data-badge="cart" hidden></span></button>
          <a class="btn btn-green" href="#/sizer">Get Started</a>
          <button class="icon-btn nav-toggle" aria-label="Menu" data-menu>${EW.icon('menu')}</button>
        </div>
      </div>`;
    EW.$('#mobile-menu').innerHTML = `
      <div class="panel">
        <div class="between" style="margin-bottom:6px">
          <img src="assets/brand/logo.png" alt="EcoWealth" style="height:26px">
          <button class="icon-btn" data-close-menu aria-label="Close">${EW.icon('x')}</button>
        </div>
        <nav>${NAV.map(([h, t]) => `<a href="#${h}">${t}${EW.icon('arrowR', 'sm')}</a>`).join('')}</nav>
        <a class="btn btn-green btn-block mt-2" href="#/sizer">Find my solar package</a>
      </div>`;
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); EW.openCart(); }
      if (e.target.closest('[data-menu]')) EW.$('#mobile-menu').classList.add('open');
      if (e.target.closest('[data-close-menu]') || e.target.id === 'mobile-menu' || e.target.closest('#mobile-menu nav a, #mobile-menu .btn')) EW.$('#mobile-menu').classList.remove('open');
    });
    const hdr = EW.$('#header');
    const onScroll = () => hdr.classList.toggle('is-stuck', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    EW.updateBadges();
  };
  EW.setActiveNav = path => {
    const root = '/' + (path.split('/')[1] || '');
    EW.$$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === root));
  };
  EW.updateBadges = () => {
    const c = S.count(), w = S.wish.length;
    EW.$$('[data-badge="cart"]').forEach(b => { b.textContent = c > 99 ? '99+' : c; b.hidden = !c; });
    EW.$$('[data-badge="wish"]').forEach(b => { b.textContent = w; b.hidden = !w; });
  };

  EW.renderFooter = () => {
    const C = EW.company;
    EW.$('#footer').innerHTML = `
      <div class="container">
        <div class="foot-grid">
          <div class="foot-brand">
            <img src="assets/brand/logo.png" alt="EcoWealth">
            <p>Speeding up Zimbabwe's move to renewable energy, with solar and financing that homes and businesses can afford.</p>
            <form class="newsletter" data-newsletter>
              <input type="email" placeholder="Your email for solar tips" required aria-label="Email">
              <button class="btn btn-green btn-sm">Subscribe</button>
            </form>
          </div>
          <div><h5>Explore</h5><ul>
            <li><a href="#/sizer">Solar Sizer</a></li><li><a href="#/packages">Solar packages</a></li>
            <li><a href="#/shop">Shop</a></li><li><a href="#/financing">Financing</a></li><li><a href="#/projects">Projects</a></li></ul></div>
          <div><h5>Shop</h5><ul>
            ${EW.categories.slice(0, 6).map(c => `<li><a href="#/shop?cat=${c.id}">${c.name}</a></li>`).join('')}</ul></div>
          <div><h5>Contact</h5><ul>
            <li class="row" style="gap:8px">${EW.icon('pin', 'sm')} ${C.address}</li>
            <li class="row" style="gap:8px">${EW.icon('phone', 'sm')} ${C.phone}</li>
            <li class="row" style="gap:8px">${EW.icon('mail', 'sm')} ${C.email}</li>
            <li class="placeholder-note">Contact details are placeholders for the demo</li></ul></div>
        </div>
        <div class="foot-bottom">
          <span>© ${new Date().getFullYear()} EcoWealth. All rights reserved.</span>
          <span>Demo concept by Bit Studio · prices, stats &amp; reviews are illustrative</span>
        </div>
      </div>`;
    EW.$('[data-newsletter]').onsubmit = e => { e.preventDefault(); e.target.reset(); EW.toast('Subscribed. Watch your inbox for solar tips.'); };
  };

  /* ---------------- cart drawer ---------------- */
  EW.openCart = () => { EW.renderCart(); EW.$('#cart').classList.add('open'); EW.$('#scrim').classList.add('open'); };
  EW.closeOverlays = () => { EW.$$('.drawer.open, .modal.open, .scrim.open').forEach(x => x.classList.remove('open')); };
  EW.lineHTML = l => `
    <div class="line-item" data-key="${l.key}">
      <div class="ph"><img src="${EW.img(l.img, 1)}" alt=""></div>
      <div class="stack-sm" style="gap:4px">
        <div class="nm">${EW.esc(l.name)}</div>
        <div class="tiny">${EW.esc(l.meta || '')}</div>
        <div class="row" style="gap:10px;margin-top:4px">
          <div class="qty"><button data-q="-1" aria-label="Decrease">${EW.icon('minus', 'sm')}</button><span>${l.qty}</span><button data-q="1" aria-label="Increase">${EW.icon('plus', 'sm')}</button></div>
          <button class="link-btn" data-rm>Remove</button>
        </div>
      </div>
      <div class="price" style="font-size:15px">${EW.money(l.price * l.qty)}</div>
    </div>`;
  EW.bindLines = root => {
    root.querySelectorAll('.line-item').forEach(r => {
      const k = r.dataset.key;
      r.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { const l = S.cart.find(x => x.key === k); S.setQty(k, l.qty + +b.dataset.q); });
      r.querySelector('[data-rm]').onclick = () => S.remove(k);
    });
  };
  EW.renderCart = () => {
    const d = EW.$('#cart');
    const sub = S.subtotal(), left = Math.max(0, EW.FREE_DELIVERY - sub);
    d.innerHTML = `
      <div class="drawer-head"><div class="h4">Your cart <span class="small">(${S.count()})</span></div>
        <button class="icon-btn" data-close aria-label="Close">${EW.icon('x')}</button></div>
      ${S.cart.length ? `
        <div class="drawer-body">
          <div class="stack-sm" style="padding:10px 0 6px">
            <div class="small">${left ? `Add <b style="color:var(--ink)">${EW.money(left)}</b> more for free delivery nationwide` : '🎉 You qualify for free delivery'}</div>
            <div class="progress"><i style="width:${Math.min(100, sub / EW.FREE_DELIVERY * 100)}%"></i></div>
          </div>
          ${S.cart.map(EW.lineHTML).join('')}
        </div>
        <div class="drawer-foot">
          <div class="between"><span class="small">Subtotal</span><b>${EW.money(sub)}</b></div>
          ${S.savings() ? `<div class="between"><span class="small">You save</span><b class="accent">−${EW.money(S.savings())}</b></div>` : ''}
          <a class="btn btn-dark btn-lg btn-block" href="#/checkout" data-close>Checkout ${EW.icon('arrowR', 'sm arrow')}</a>
          <a class="btn btn-outline btn-block" href="#/cart" data-close>View full cart</a>
        </div>` : `
        <div class="drawer-body"><div class="empty" style="margin-top:20px">
          <div class="h3">Your cart is empty</div><p>Start with the Solar Sizer and we'll recommend what to buy.</p>
          <div class="row" style="justify-content:center"><a class="btn btn-green" href="#/sizer" data-close>Open Solar Sizer</a><a class="btn btn-outline" href="#/shop" data-close>Browse shop</a></div>
        </div></div>`}`;
    d.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', EW.closeOverlays));
    EW.bindLines(d);
  };
  S.on(() => { if (EW.$('#cart').classList.contains('open')) EW.renderCart(); });

  /* ---------------- modal ---------------- */
  EW.openModal = (html, cls = '') => {
    const m = EW.$('#modal');
    m.innerHTML = `<div class="modal-box ${cls}" role="dialog" aria-modal="true"><button class="icon-btn modal-close" aria-label="Close">${EW.icon('x')}</button>${html}</div>`;
    m.classList.add('open'); EW.$('#scrim').classList.add('open');
    m.querySelector('.modal-close').onclick = EW.closeOverlays;
    m.onclick = e => { if (e.target === m) EW.closeOverlays(); };
    return m.querySelector('.modal-box');
  };

  /* ---------------- compare bar ---------------- */
  EW.renderCompareBar = () => {
    const bar = EW.$('#compare-bar');
    const items = S.compare.map(id => EW.products.find(p => p.id === id)).filter(Boolean);
    const onShop = location.hash.startsWith('#/shop');
    const show = items.length > 0 && onShop;
    bar.classList.toggle('show', show);
    bar.style.visibility = show ? 'visible' : 'hidden';
    bar.innerHTML = `<div class="thumbs">${items.map(p => `<img src="${EW.img(p.img, 1)}" alt="">`).join('')}</div>
      <span style="font-size:14px">${items.length} of 4 selected</span>
      <button class="btn btn-ghost btn-sm" style="color:#fff" data-clear>Clear</button>
      <a class="btn btn-green btn-sm" href="#/compare">Compare ${EW.icon('arrowR', 'sm')}</a>`;
    bar.querySelector('[data-clear]').onclick = () => { S.compare = []; S.save(); EW.renderCompareBar(); EW.$$('[data-cmp]').forEach(b => b.classList.remove('on')); };
  };

  /* ---------------- reveal on scroll ---------------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  EW.reveal = root => EW.$$('.reveal', root).forEach(el => io ? io.observe(el) : el.classList.add('in'));

  // count-up numbers
  EW.countUp = root => EW.$$('[data-count]', root).forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    let started = false;
    const run = () => {
      if (started) return; started = true;
      const t0 = performance.now(), dur = 1400;
      const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(end * e).toLocaleString('en-US') + suf; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (io) new IntersectionObserver((es, o) => es.forEach(x => { if (x.isIntersecting) { run(); o.disconnect(); } })).observe(el); else run();
  });

  // real customer-style portraits (assets/img/avatars)
  EW.avatars = (n, from = 1) => `<div class="avatars">${Array.from({ length: n }, (_, k) => `<img src="assets/img/avatars/a${from + k}.jpg" alt="" loading="lazy">`).join('')}</div>`;

  /* floating WhatsApp button — hidden while the home hero fills the screen, so it never covers hero content */
  const WA_GLYPH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.89 9.88zm8.41-18.3A11.81 11.81 0 0012.04 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.31-1.65a11.88 11.88 0 005.67 1.44h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41z"/></svg>';
  EW.initWaFab = () => {
    const fab = EW.$('#wa-fab');
    fab.href = EW.waLink("Hi EcoWealth! I'd like to find out more about going solar.");
    fab.innerHTML = `<span class="wa-ic">${WA_GLYPH}</span><span class="wa-label">Chat with us</span>`;
    const upd = () => {
      const onHome = !location.hash || location.hash === '#/' || location.hash.startsWith('#/?');
      fab.classList.toggle('show', !onHome || window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('hashchange', () => setTimeout(upd, 0));
    upd();
  };

  EW.waLink = text => `https://wa.me/${EW.company.whatsapp}?text=${encodeURIComponent(text)}`;
})();
