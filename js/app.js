/* Hash router — works from file:// with no build step */
(function () {
  const routes = [
    [/^\/$/, 'home'],
    [/^\/sizer$/, 'sizer'],
    [/^\/packages$/, 'packages'],
    [/^\/packages\/([\w-]+)$/, 'packageDetail', ['slug']],
    [/^\/financing$/, 'financing'],
    [/^\/shop$/, 'shop'],
    [/^\/shop\/([\w-]+)$/, 'product', ['id']],
    [/^\/compare$/, 'compare'],
    [/^\/wishlist$/, 'wishlist'],
    [/^\/cart$/, 'cart'],
    [/^\/checkout$/, 'checkout'],
    [/^\/order\/(\w+)$/, 'order', ['id']],
    [/^\/projects$/, 'projects'],
    [/^\/about$/, 'about'],
    [/^\/contact$/, 'contact'],
  ];
  const TITLES = { home: 'Solar packages & shop', sizer: 'Solar Sizer', packages: 'Solar packages', financing: 'Financing', shop: 'Shop', compare: 'Compare', wishlist: 'Wishlist', cart: 'Cart', checkout: 'Checkout', order: 'Order confirmed', projects: 'Projects', about: 'About', contact: 'Contact' };
  const LIGHT_HEADER = ['product', 'compare', 'wishlist', 'cart', 'checkout', 'order', 'notFound'];

  let silent = false, lastPath = null;
  EW.go = path => { location.hash = '#' + path; };
  EW.replace = path => { silent = true; history.replaceState(null, '', '#' + path); setTimeout(() => (silent = false)); };
  EW.rerender = () => render(true);

  function parse() {
    const raw = location.hash.slice(1) || '/';
    const [path, qs] = raw.split('?');
    const params = Object.fromEntries(new URLSearchParams(qs || ''));
    for (const [re, name, keys] of routes) {
      const m = path.match(re);
      if (m) { (keys || []).forEach((k, i) => (params[k] = m[i + 1])); return { name, params, path }; }
    }
    return { name: 'notFound', params, path };
  }

  function render(keepScroll) {
    if (silent) return;
    const { name, params, path } = parse();
    const view = EW.views[name] || EW.views.notFound;
    const app = EW.$('#app');
    const y = window.scrollY;
    EW.closeOverlays();
    app.innerHTML = view(params);
    const hdr = EW.$('#header');
    hdr.classList.toggle('light', LIGHT_HEADER.includes(name));
    EW.setActiveNav(path);
    document.title = `EcoWealth — ${TITLES[name] || 'Solar'}`;
    if (view.mount) view.mount(app, params);
    EW.reveal(app); EW.countUp(app);
    EW.renderCompareBar();
    window.scrollTo(0, keepScroll || path === lastPath ? y : 0);
    lastPath = path;
    app.focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', () => render());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') EW.closeOverlays(); });

  document.addEventListener('DOMContentLoaded', () => {
    EW.renderHeader();
    EW.renderFooter();
    EW.$('#scrim').onclick = EW.closeOverlays;
    render();
  });
})();
