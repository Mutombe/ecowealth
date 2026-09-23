/* Home — mirrors the reference boards section by section */
(function () {
  const I = EW.icon;

  EW.views.home = () => {
    const featured = ['sprout-3kva', 'grove-5kva', 'canopy-5kva-plus'].map(s => EW.packages.find(p => p.slug === s));
    const shopPicks = ['deye-5', 'pylon-us5000', 'ja-550', 'geyser-150'].map(id => EW.products.find(p => p.id === id));
    const quickApps = ['fridge', 'tv', 'lights-lounge', 'pump', 'washer', 'micro', 'laptop', 'ac', 'geyser', 'iron', 'cctv', 'kettle'];
    const hot = EW.packages.find(p => p.slug === 'grove-5kva');

    return `
    <section class="hero" id="top">
      <div class="hero-media"><img src="${EW.img('roof-house-sunset')}" alt="Home with rooftop solar panels at sunset" fetchpriority="high"></div>

      <div class="hotspot" style="right:max(var(--gutter), calc((100vw - var(--container)) / 2 + var(--gutter)));top:clamp(110px,15vh,150px)">
        <a class="hotspot-card" href="#/packages/${hot.slug}" style="display:block">
          <div class="t">24 hours electricity</div>
          <div class="s">${hot.full} · Solar System</div>
          <div class="p">${EW.money(hot.price)}</div>
        </a>
        <span class="hotspot-line"></span><span class="hotspot-dot"></span>
      </div>

      <div class="container hero-inner">
        <div class="hero-top">
          <div class="join-chip glass">
            <div class="top"><span>Join Us Today!</span><span class="stars">★★★★★</span></div>
            <div class="row">
              ${EW.avatars(4)}
              <div><b>1,200+</b><small>Powered households</small></div>
            </div>
          </div>
          <span class="rating-pill glass only-sm"><span class="stars">★</span> 4.9 <small>· 380 reviews</small></span>
        </div>

        <a class="hero-float only-sm" href="#/packages/${hot.slug}">
          <span class="hf-card">
            <span class="hf-ic">${I('bolt', 'sm')}</span>
            <span><span class="t">24 hours electricity</span><span class="s">${hot.full}</span></span>
            <span class="p">${EW.money(hot.price)}</span>
          </span>
          <span class="hf-line"></span><span class="hf-dot"></span>
        </a>

        <div class="hero-main">
          <span class="hero-eyebrow glass only-sm">${I('sun', 'sm')} Solar sized to your appliances</span>
          <h1 class="display">Find your <span class="accent">perfect solar</span> with ease and confidence</h1>
          <p class="hero-sub">Tell us what you want to power, and we'll recommend the right solar package for your home or business in under a minute.</p>
          <div class="hero-cta only-sm">
            <a class="btn btn-green btn-lg" href="#/sizer">Find my package ${I('arrowR', 'sm arrow')}</a>
            <a class="btn btn-lg glass hero-ghost" href="#/packages">Packages</a>
          </div>
          <div class="hero-bottom">
            <form class="hero-search" data-hero-search>
              <input type="search" name="q" placeholder="Search packages, panels, batteries…" aria-label="Search">
              <button class="circle-go" aria-label="Search">${I('search', 'sm')}</button>
            </form>
            <a class="scroll-down" href="#intro" data-scroll>Scroll Down <span class="circle-go">${I('arrowD', 'sm')}</span></a>
          </div>
          <div class="hero-strip glass only-sm">
            <span><b>0%</b><small>6-month finance</small></span>
            <span><b>25 yr</b><small>Panel warranty</small></span>
            <span><b>24/7</b><small>Monitoring</small></span>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="intro">
      <div class="container">
        <div class="intro-split reveal">
          <div class="left">
            <h3>Transforming Homes with Tailored Solar Expertise</h3>
            <p>We look at your actual appliances, how long you use them and your load-shedding hours. You get a system sized for your household, not a one-size-fits-all bundle.</p>
          </div>
          <div class="right">
            <h2 class="h2"><b>Maximizing Energy</b> Savings Through Cutting-Edge Solar Solutions</h2>
          </div>
        </div>
        <div class="stats reveal">
          <div class="stat"><b data-count="500" data-suffix="+">500+</b><span>Systems Installed</span></div>
          <div class="stat"><b data-count="1200" data-suffix="+">1,200+</b><span>Satisfied Clients</span></div>
          <div class="stat"><b data-count="3500" data-suffix="kW">3,500kW</b><span>Solar Capacity Deployed</span></div>
          <div class="stat"><b data-count="24" data-suffix="/7">24/7</b><span>Remote Monitoring</span></div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="sec-head reveal">
          <h2 class="h2">Your <em class="it">primary</em> home deserves power too — time for a refresh?</h2>
          <a class="sec-note" href="#/projects">
            <span class="thumb"><img src="${EW.img('installer-sunset', 1)}" alt=""></span>
            <span>Every system is designed, installed and commissioned by certified EcoWealth technicians.</span>
          </a>
        </div>
        <div class="bento reveal">
          <a class="b-img" href="#/packages/grove-5kva">
            <img src="${EW.img('house-solar')}" alt="Home with solar panels">
            <span class="tag chip glassy">${I('sun', 'sm')} Grove 5kVA · Harare</span>
          </a>
          <div class="b-text">
            <h3>Big savings can start with small systems.</h3>
            <p>With smart sizing and the right battery, even a 3kVA system can cover a family home through load-shedding.</p>
            <a class="btn btn-outline btn-sm" href="#/packages">Details</a>
          </div>
          <div class="b-price">
            <div class="ph"><img src="${EW.img('battery-wall', 1)}" alt="Wall-mounted lithium batteries"></div>
            <div class="foot">
              <p>Packages start at <b>${EW.money(EW.packages[0].price)}</b></p>
              <a class="btn btn-lime btn-sm" href="#/packages">Explore Packages ${I('arrowR', 'sm arrow')}</a>
            </div>
          </div>
        </div>
        <p class="bento-caption reveal">Good solar design isn't about the biggest system. It's about the right one for how you actually live.</p>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <div class="cta-band reveal" style="padding:0;background:#0f1510">
          <div class="sizer-teaser" style="display:grid;grid-template-columns:1.05fr 1fr;gap:0">
            <div style="padding:clamp(28px,5vw,56px)">
              <span class="eyebrow" style="color:#b6ec8e">Solar Sizer</span>
              <h2 class="h2" style="margin-top:14px">Pick your appliances. <span class="accent">We'll size the system.</span></h2>
              <p style="margin:16px 0 22px">Tap what you use every day to see a live estimate. The full Sizer adds quantities, hours, load-shedding and a 24-hour battery simulation.</p>
              <div class="row" style="gap:8px" data-quick>
                ${quickApps.map(id => { const a = EW.appliances.find(x => x.id === id); return `<button class="chip" style="background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.15);height:36px;padding:0 14px;cursor:pointer" data-app="${id}">${I(a.ic, 'sm')} ${a.name.replace(/ \(.*\)/, '')}</button>`; }).join('')}
              </div>
            </div>
            <div style="padding:clamp(20px,4vw,40px);display:flex;align-items:center">
              <div class="summary-card" style="position:static;width:100%;background:#1a221b" data-quick-out></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="sec-head reveal">
          <h2 class="h2">Explore solar packages for every home</h2>
          <p class="sec-note">Find the right match: supplied, installed and supported, with every component warranty clearly listed.</p>
        </div>
        <div class="cards-3">${featured.map((p, i) => EW.pkgCard(p, 'reveal', i)).join('')}</div>
        <div class="row mt-3" style="justify-content:center"><a class="btn btn-outline" href="#/packages">View all ${EW.packages.length} packages ${I('arrowR', 'sm arrow')}</a></div>
      </div>
    </section>

    <section class="section bg-soft">
      <div class="container">
        <div class="sec-head reveal">
          <h2 class="h2">Shop <span class="soft">tier-1 solar</span> components</h2>
          <div class="row"><span class="sec-note" style="max-width:260px">Panels, inverters, lithium batteries and solar geysers, with delivery across Zimbabwe.</span><a class="btn btn-dark" href="#/shop">Visit shop ${I('arrowR', 'sm arrow')}</a></div>
        </div>
        <div class="cards-4">${shopPicks.map(p => EW.productCard(p, 'reveal')).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="intro-split reveal" style="margin-bottom:clamp(32px,5vw,56px)">
          <div class="left"><span class="eyebrow">Why EcoWealth</span></div>
          <div class="right"><h2 class="h2"><b>Solar projects for all.</b> Designed well, installed properly, and financed so they're within reach.</h2></div>
        </div>
        <div class="why">
          ${[
        ['chart', 'Sized, not guessed', 'Our Sizer models your appliances hour by hour, so you don\'t overpay for a system you don\'t need.'],
        ['shield', 'Tier-1 components', 'JA, Jinko, Deye, Sunsynk and Pylontech, with warranties of up to 25 years.'],
        ['wallet', 'Flexible financing', 'Spread the cost over 6, 12 or 24 months. 6-month plans are interest-free.'],
        ['wifi', 'Monitored 24/7', 'Every system comes online on day one. We catch faults before you notice them.'],
      ].map(([ic, t, d]) => `<div class="card reveal"><span class="ic">${I(ic)}</span><div class="h4">${t}</div><p class="small" style="margin:0">${d}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="sec-head reveal">
          <h2 class="h2">Client Feedback</h2>
          <div class="join-chip" style="background:#fff;border:1px solid var(--line);color:var(--ink)">
            <div class="top"><span>Join Us Today!</span><span class="stars">★★★★★</span></div>
            <div class="row">${EW.avatars(3, 5)}<div><b>1,200+</b><small style="color:var(--muted)">Satisfied Customers</small></div></div>
          </div>
        </div>
        <div class="feedback reveal" data-feedback>
          <img src="${EW.img('roof-house-sunset')}" alt="">
          <div class="quote-card glass" data-quote></div>
          <div class="quote-dots" data-dots></div>
          <div class="quote-nav"><button data-prev aria-label="Previous">${I('arrowL', 'sm')}</button><button data-next aria-label="Next">${I('arrowR', 'sm')}</button></div>
        </div>
        <p class="tiny" style="margin-top:10px">Sample testimonials for the demo. Replace with real EcoWealth client reviews.</p>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="sec-head reveal"><h2 class="h2">From first click to <span class="accent">first kilowatt</span></h2><p class="sec-note">Most homes are installed within 5–7 days of the site survey.</p></div>
        <div class="process">
          ${[['Size it', 'Pick your appliances in the Solar Sizer and get your recommended package.'], ['Survey', 'A technician visits to check your roof, wiring and shading. It\'s free in Harare.'], ['Install', 'A one-day install for most homes, with a certificate of compliance.'], ['Monitor', 'The app goes live and we monitor your system 24/7, with support for life.']]
        .map(([t, d]) => `<div class="card soft reveal"><div class="h4">${t}</div><p class="small" style="margin:8px 0 0">${d}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="cta-band reveal">
          <img src="${EW.img('panels-sky')}" alt="">
          <span class="eyebrow" style="color:#b6ec8e">Financing available</span>
          <h2 class="h2" style="margin:14px 0">Own your power from <span class="accent">${EW.money(Math.round(EW.packages[1].price / 6))}/month</span></h2>
          <p>Pay over 6 months interest-free, or over 12–24 months at a low flat rate. Your panels start saving from day one.</p>
          <div class="row mt-3"><a class="btn btn-green btn-lg" href="#/sizer">Find my package ${I('arrowR', 'sm arrow')}</a><a class="btn btn-white btn-lg" href="#/financing">See financing</a></div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="container grid-2" style="gap:clamp(24px,6vw,96px);align-items:start">
        <div class="reveal"><h2 class="h2">Questions, answered</h2><p class="lead mt-2">Can't find what you need? <a href="#/contact" style="text-decoration:underline">Talk to our engineers</a>.</p></div>
        <div class="faq reveal">
          ${[
        ['How accurate is the Solar Sizer?', 'It uses the same method our engineers use: running watts, start-up surge, hours of use and when in the day you use each appliance, plus Zimbabwe\'s 5.5 peak sun hours. A free site survey confirms the final design before you pay.'],
        ['Will it run during load-shedding?', 'Yes. Hybrid inverters switch over in under 10 milliseconds, so lights, Wi-Fi and TVs won\'t even flicker.'],
        ['Can I run my geyser on solar?', 'You can, but it needs a much bigger system. A solar geyser is usually the smarter buy. It takes 40–60% off a typical home\'s energy use.'],
        ['What warranties do I get?', 'Panels 25 years (performance), lithium batteries 10 years, inverters 5–10 years, and our workmanship 12 months.'],
        ['Which payment methods do you accept?', 'EcoCash, InnBucks, ZimSwitch, Visa/Mastercard, bank transfer, and a 20% deposit with the balance paid on installation.'],
      ].map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}
        </div>
      </div>
    </section>`;
  };

  EW.views.home.mount = root => {
    EW.$('[data-hero-search]', root).onsubmit = e => { e.preventDefault(); const q = e.target.q.value.trim(); EW.go('/shop' + (q ? '?q=' + encodeURIComponent(q) : '')); };
    EW.$('[data-scroll]', root).onclick = e => { e.preventDefault(); EW.$('#intro').scrollIntoView({ behavior: 'smooth' }); };

    // quick sizer
    const picked = new Set(['fridge', 'tv', 'lights-lounge', 'router']);
    const out = EW.$('[data-quick-out]', root);
    const draw = () => {
      const sel = {};
      picked.forEach(id => { const a = EW.appliances.find(x => x.id === id); sel[id] = { qty: a.qty || 1, hours: a.h }; });
      EW.$$('[data-app]', root).forEach(b => {
        const on = picked.has(b.dataset.app);
        b.style.background = on ? 'var(--green)' : 'rgba(255,255,255,.08)';
        b.style.color = on ? '#0d1a07' : '#fff';
      });
      const r = EW.sizer.size(sel, { goal: 'hybrid', outage: 8 });
      const b = r.match.best.p;
      out.innerHTML = `
        <div class="between"><span class="tiny" style="color:rgba(255,255,255,.6)">Recommended for you</span><span class="chip green">${b.tier}</span></div>
        <div><div class="big">${b.full}</div><div class="tiny" style="color:rgba(255,255,255,.6);margin-top:6px">${b.pvKW}kWp solar · ${b.batteryKWh}kWh battery · ${EW.money(b.price)}</div></div>
        <div class="row"><span>Daily use</span><b>${EW.fmt(r.need.dailyKWh)} kWh</b></div>
        <div class="row"><span>Peak load</span><b>${EW.fmt(r.need.peakW / 1000, 2)} kW</b></div>
        <div class="row"><span>Appliances</span><b>${picked.size}</b></div>
        <a class="btn btn-green btn-block" href="#/sizer?s=${EW.sizer.encode(sel, { goal: 'hybrid', outage: 8 })}">Get my full recommendation ${EW.icon('arrowR', 'sm arrow')}</a>`;
      out.querySelectorAll('.row').forEach(x => x.className = 'row between');
    };
    EW.$$('[data-app]', root).forEach(b => b.onclick = () => { picked.has(b.dataset.app) ? picked.delete(b.dataset.app) : picked.add(b.dataset.app); draw(); });
    draw();

    // testimonials carousel
    let i = 0;
    const q = EW.$('[data-quote]', root), dots = EW.$('[data-dots]', root);
    const show = () => {
      const t = EW.testimonials[i];
      q.style.opacity = 0;
      setTimeout(() => {
        q.innerHTML = `<div class="stars" style="font-size:16px">★★★★★</div><h4>${t.title}</h4><p>“${t.text}”</p><div class="who row" style="gap:10px"><img class="who-av" src="assets/img/avatars/a${[1, 6, 3][i]}.jpg" alt="">— ${t.who}</div>`;
        q.style.transition = 'opacity .4s'; q.style.opacity = 1;
      }, 150);
      dots.innerHTML = EW.testimonials.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
    };
    EW.$('[data-next]', root).onclick = () => { i = (i + 1) % EW.testimonials.length; show(); };
    EW.$('[data-prev]', root).onclick = () => { i = (i + EW.testimonials.length - 1) % EW.testimonials.length; show(); };
    show();
    const timer = setInterval(() => { if (!document.body.contains(q)) return clearInterval(timer); i = (i + 1) % EW.testimonials.length; show(); }, 7000);
  };
})();
