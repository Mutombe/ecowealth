/* Projects, About, Contact, 404 */
(function () {
  const I = EW.icon;

  EW.views.projects = () => `
    <section class="page-hero">
      <div class="bg"><img src="${EW.img('field-sunset')}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <span>Projects</span></div>
        <h1 class="h1">Solar that's <span class="accent">already working</span></h1>
        <p>Homes, businesses and farms across Zimbabwe. Every one sized, installed and monitored by EcoWealth.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="stats-card" style="margin-top:calc(-1 * clamp(80px,10vw,120px));position:relative">
          <div class="intro-split"><div class="left"><h3>Engineered for Zimbabwe's grid, sun and seasons</h3></div>
            <div class="right"><div class="h3"><b style="font-weight:500">Real systems</b> <span class="soft">keeping lights, cold rooms and clinics on through load-shedding.</span></div></div></div>
          <div class="stats">
            <div class="stat"><b data-count="500" data-suffix="+">500+</b><span>Installations</span></div>
            <div class="stat"><b data-count="3500" data-suffix="kW">3,500kW</b><span>Capacity deployed</span></div>
            <div class="stat"><b data-count="4800" data-suffix="t">4,800t</b><span>CO₂ avoided / year</span></div>
            <div class="stat"><b data-count="10" data-suffix="">10</b><span>Provinces served</span></div>
          </div>
        </div>
        <div class="sec-head mt-4"><h2 class="h2">Featured installations</h2>
          <div class="seg" data-pf>${[['all', 'All'], ['home', 'Homes'], ['business', 'Business'], ['farm', 'Farms']].map(([v, t], k) => `<button class="${k ? '' : 'on'}" data-v="${v}">${t}</button>`).join('')}</div></div>
        <div class="masonry" data-grid></div>
        <p class="tiny">Showcase uses sample entries. Replace with EcoWealth's own project photos and details.</p>
      </div>
    </section>`;
  EW.views.projects.mount = root => {
    const draw = f => EW.$('[data-grid]', root).innerHTML = EW.projects.filter(p => f === 'all' || p.seg === f).map(p =>
      `<figure class="reveal in"><img src="${EW.img(p.img, 1)}" alt="${EW.esc(p.t)}" loading="lazy"><figcaption class="glass"><b>${p.t}</b>${p.s}</figcaption></figure>`).join('');
    EW.$$('[data-pf] button', root).forEach(b => b.onclick = () => { EW.$$('[data-pf] button', root).forEach(x => x.classList.toggle('on', x === b)); draw(b.dataset.v); });
    draw('all');
  };

  EW.views.about = () => `
    <section class="page-hero">
      <div class="bg"><img src="${EW.img('engineer')}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <span>About</span></div>
        <h1 class="h1">Solar energy <span class="accent">projects for all</span></h1>
        <p>EcoWealth's mission is to speed up Zimbabwe's move to renewable energy by making solar projects possible for everyone.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="intro-split">
          <div class="left"><h3>Our mission</h3><p>To give communities across Zimbabwe and Africa clean, reliable and affordable energy. We do it through well-designed solar solutions and by driving investment into sustainable projects.</p></div>
          <div class="right"><h2 class="h2"><b>Certified solar experts</b> who listen first, design second, and stay with you long after installation.</h2></div>
        </div>
        <div class="bento mt-4">
          <div class="b-img"><img src="${EW.img('installer-sunset')}" alt="EcoWealth installer on a roof"></div>
          <div class="b-text"><h3>Residential solar</h3><p>Affordable installations sized to your household, for energy independence at a sensible cost.</p><a class="btn btn-outline btn-sm" href="#/packages">Home packages</a></div>
          <div class="b-text" style="background:var(--ink);color:#fff;border:0"><h3 style="color:#fff">Commercial &amp; project finance</h3><p style="color:rgba(255,255,255,.7)">Scalable systems for businesses, and project financing that gets green energy built.</p><a class="btn btn-green btn-sm" href="#/financing">Financing</a></div>
        </div>
      </div>
    </section>
    <section class="section bg-soft">
      <div class="container">
        <div class="sec-head"><h2 class="h2">How we work with you</h2></div>
        <div class="why">
          ${[['users', 'Personalised service', 'We take time to understand your goals and how you use energy before we design anything.'], ['chart', 'Custom design', 'Every system is engineered around your load profile, roof and budget.'], ['wifi', 'Performance monitoring', 'Ongoing support, maintenance guidance and remote monitoring for the life of your system.'], ['wallet', 'Access to finance', 'Solar project financing so more families and businesses can go solar now.']]
      .map(([ic, t, d]) => `<div class="card"><span class="ic">${I(ic)}</span><div class="h4">${t}</div><p class="small" style="margin:0">${d}</p></div>`).join('')}
        </div>
      </div>
    </section>
    <section class="section"><div class="container"><div class="cta-band"><img src="${EW.img('panels-trees')}" alt="">
      <h2 class="h2">Ready to own your power?</h2><p>Start with the Solar Sizer. It takes a minute and gives you a real, priced recommendation.</p>
      <div class="row mt-2"><a class="btn btn-green btn-lg" href="#/sizer">Open Solar Sizer ${I('arrowR', 'sm arrow')}</a><a class="btn btn-white btn-lg" href="#/contact">Talk to us</a></div></div></div></section>`;

  EW.views.contact = params => `
    <section class="page-hero">
      <div class="bg"><img src="${EW.img('roof-commercial')}" alt=""></div>
      <div class="container">
        <div class="crumbs"><a href="#/">Home</a> / <span>Contact</span></div>
        <h1 class="h1">Let's talk <span class="accent">solar</span></h1>
        <p>Questions, quotes, financing or after-sales support. Our engineers reply within 2 working hours.</p>
      </div>
    </section>
    <section class="section">
      <div class="container grid-2 grid-wide" style="gap:clamp(24px,5vw,64px);align-items:start">
        <div class="card" style="padding:clamp(20px,3vw,32px)" data-cbox>
          <div class="h3" style="margin-bottom:18px">Send us a message</div>
          <form class="form-grid" data-cform novalidate>
            <div class="field"><label>Full name</label><input class="input" name="name" required></div>
            <div class="field"><label>Phone / WhatsApp</label><input class="input" name="phone" required></div>
            <div class="field full"><label>Email</label><input class="input" type="email" name="email"></div>
            <div class="field full"><label>I'm interested in</label>
              <select class="select" name="topic">${[['quote', 'A quote for a solar system'], ['financing', 'Solar financing'], ['shop', 'Buying products'], ['commercial', 'Commercial / project finance'], ['support', 'After-sales support']].map(([v, t]) => `<option value="${v}" ${params.topic === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
            <div class="field full"><label>Message</label><textarea class="textarea" name="msg" placeholder="Tell us about your property and what you'd like to power">${params.amt ? `I'd like to finance a system of about ${EW.money(params.amt)}.` : ''}</textarea></div>
            <div class="full"><button class="btn btn-dark btn-lg">Send message ${I('arrowR', 'sm arrow')}</button></div>
          </form>
        </div>
        <div class="stack">
          ${[['phone', 'Call us', EW.company.phone], ['whatsapp', 'WhatsApp', EW.company.phone], ['mail', 'Email', EW.company.email], ['pin', 'Visit', EW.company.address], ['clock', 'Hours', 'Mon–Fri 8:00–17:00 · Sat 8:00–13:00']]
      .map(([ic, t, d]) => `<div class="card row" style="gap:14px;flex-wrap:nowrap"><span class="circle-go" style="width:44px;height:44px">${I(ic, 'sm')}</span><div><div class="tiny">${t}</div><div style="font-weight:500">${d}</div></div></div>`).join('')}
          <a class="btn btn-green btn-lg" target="_blank" rel="noopener" href="${EW.waLink('Hi EcoWealth, I\'d like to talk about solar.')}">${I('whatsapp', 'sm')} Chat on WhatsApp</a>
          <p class="placeholder-note" style="margin:0">Contact details are placeholders. Confirm with EcoWealth.</p>
        </div>
      </div>
    </section>`;
  EW.views.contact.mount = root => {
    EW.$('[data-cform]', root).onsubmit = e => {
      e.preventDefault(); const f = e.target; let ok = true;
      ['name', 'phone'].forEach(n => { const bad = f[n].value.trim().length < 2; f[n].classList.toggle('err', bad); if (bad) ok = false; });
      if (!ok) return;
      EW.$('[data-cbox]', root).innerHTML = `<div style="text-align:center;padding:40px 10px"><div class="success-ring">${I('check')}</div><div class="h3">Message sent</div><p class="lead" style="margin:10px auto">Thanks, ${EW.esc(f.name.value.split(' ')[0])}. We'll be in touch within 2 working hours.</p><a class="btn btn-outline" href="#/sizer">Meanwhile, try the Solar Sizer</a></div>`;
    };
  };

  EW.views.notFound = () => `
    <section class="section" style="padding-top:160px"><div class="container"><div class="empty">
      <div class="h2">Page not found</div><p>That page doesn't exist or has moved.</p>
      <div class="row" style="justify-content:center"><a class="btn btn-dark" href="#/">Go home</a><a class="btn btn-outline" href="#/sizer">Solar Sizer</a></div></div></div></section>`;
})();
