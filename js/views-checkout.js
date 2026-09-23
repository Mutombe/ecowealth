/* Cart page, 3-step checkout, order confirmation & tracking */
(function () {
  const I = EW.icon, S = EW.store;
  const PAY = [
    { id: 'ecocash', name: 'EcoCash', ic: 'phoneSm', note: 'Prompt sent to your phone', mobile: true },
    { id: 'innbucks', name: 'InnBucks', ic: 'wallet', note: 'Pay with InnBucks code' },
    { id: 'onemoney', name: 'OneMoney', ic: 'phoneSm', note: 'Prompt sent to your phone', mobile: true },
    { id: 'card', name: 'Visa / Mastercard', ic: 'card', note: 'Secure card payment' },
    { id: 'zimswitch', name: 'ZimSwitch', ic: 'bank', note: 'Local bank cards' },
    { id: 'bank', name: 'Bank transfer', ic: 'bank', note: 'We email banking details' },
  ];

  const summary = (compact) => `
    <div class="card order-summary" style="padding:22px">
      <div class="h4" style="margin-bottom:12px">Order summary</div>
      ${compact ? S.cart.map(l => `<div class="row" style="gap:12px;flex-wrap:nowrap;padding:8px 0"><div style="position:relative;flex:none"><img src="${EW.img(l.img, 1)}" alt="" style="width:52px;height:52px;border-radius:10px;object-fit:cover"><span class="badge" style="position:absolute;top:-6px;right:-6px;background:var(--ink);color:#fff;border-radius:99px;font-size:11px;min-width:19px;height:19px;display:grid;place-items:center">${l.qty}</span></div><div class="small" style="flex:1;color:var(--ink);line-height:1.3">${EW.esc(l.name)}</div><b class="small" style="color:var(--ink)">${EW.money(l.price * l.qty)}</b></div>`).join('') + '<hr class="divider" style="margin:12px 0">' : ''}
      <dl class="kv">
        <dt>Subtotal</dt><dd>${EW.money(S.subtotal())}</dd>
        ${S.savings() ? `<dt>Savings</dt><dd class="accent">−${EW.money(S.savings())}</dd>` : ''}
        ${S.discount() ? `<dt>Coupon ${S.coupon}</dt><dd class="accent">−${EW.money(S.discount())}</dd>` : ''}
        <dt>Delivery</dt><dd>${S.delivery() ? EW.money(S.delivery()) : 'Free'}</dd>
      </dl>
      <hr class="divider" style="margin:14px 0">
      <div class="between"><b>Total (USD)</b><b class="h3">${EW.money(S.total())}</b></div>
      <div class="row tiny mt-2" style="gap:14px"><span class="row" style="gap:6px">${I('shield', 'sm')} Secure checkout</span><span class="row" style="gap:6px">${I('check', 'sm')} Tier-1 guaranteed</span></div>
    </div>`;

  /* ---------------- cart page ---------------- */
  EW.views.cart = () => `
    <section style="padding-top:calc(env(safe-area-inset-top,0px) + 110px)" class="section-tight">
      <div class="container">
        <div class="crumbs dark"><a href="#/">Home</a> / <span>Cart</span></div>
        <h1 class="h2 mt-1" style="margin-bottom:24px">Your cart <span class="soft">(${S.count()})</span></h1>
        ${S.cart.length ? `
        <div class="checkout">
          <div>
            <div class="card" style="padding:4px 22px" data-lines>${S.cart.map(EW.lineHTML).join('')}</div>
            <div class="between mt-2"><a class="btn btn-ghost" href="#/shop">${I('arrowL', 'sm')} Continue shopping</a><button class="btn btn-ghost" data-clear>${I('trash', 'sm')} Clear cart</button></div>
          </div>
          <div class="stack">
            <div class="card stack-sm" style="padding:22px">
              <div class="field"><label>Delivery area</label>
                <select class="select" data-zone>${EW.zones.map(z => `<option value="${z.id}" ${S.zone === z.id ? 'selected' : ''}>${z.name}${z.km ? ` — ${EW.money(EW.deliveryFee(z.km))}` : ' — Free'}</option>`).join('')}</select>
                <span class="tiny">$5 + $0.65/km from Harare · Free over ${EW.money(EW.FREE_DELIVERY)}</span></div>
              <div class="field mt-1"><label>Coupon code</label>
                <form class="row" style="gap:8px;flex-wrap:nowrap" data-coupon><input class="input" name="c" placeholder="Try SUNNY10" value="${S.coupon || ''}" style="height:42px"><button class="btn btn-outline">Apply</button></form></div>
            </div>
            ${summary(false)}
            <a class="btn btn-dark btn-lg btn-block" href="#/checkout">Proceed to checkout ${I('arrowR', 'sm arrow')}</a>
          </div>
        </div>` : `<div class="empty"><div class="h3">Your cart is empty</div><p>Find the right system in the Solar Sizer, or browse the shop.</p><div class="row" style="justify-content:center"><a class="btn btn-green" href="#/sizer">Solar Sizer</a><a class="btn btn-outline" href="#/shop">Shop</a></div></div>`}
      </div>
    </section>`;
  EW.views.cart.mount = root => {
    const lines = EW.$('[data-lines]', root); if (!lines) return;
    EW.bindLines(lines);
    EW.$('[data-zone]', root).onchange = e => { S.zone = e.target.value; S.save(); EW.rerender(); };
    EW.$('[data-coupon]', root).onsubmit = e => {
      e.preventDefault(); const c = e.target.c.value.trim().toUpperCase();
      if (!c) { S.coupon = null; S.save(); EW.rerender(); return; }
      if (EW.coupons[c]) { S.coupon = c; S.save(); EW.toast(`Coupon applied: ${EW.coupons[c].label}`); EW.rerender(); } else { e.target.c.classList.add('err'); EW.toast('That coupon code isn\'t valid'); }
    };
    const clr = EW.$('[data-clear]', root);
    clr.onclick = () => {
      if (clr.dataset.confirm) { S.cart = []; S.save(); EW.rerender(); return; }
      clr.dataset.confirm = 1; clr.innerHTML = `${I('alert', 'sm')} Tap again to clear`; clr.style.color = 'var(--danger)';
      setTimeout(() => { if (clr.isConnected) { delete clr.dataset.confirm; clr.innerHTML = `${I('trash', 'sm')} Clear cart`; clr.style.color = ''; } }, 3000);
    };
  };

  /* ---------------- checkout ---------------- */
  const co = { step: 1, method: 'delivery', pay: 'ecocash', plan: 'full', d: {} };
  EW.views.checkout = params => {
    if (params.pay) co.plan = params.pay === 'deposit' ? 'deposit' : 'full';
    if (!S.cart.length) return `<section style="padding-top:140px" class="section"><div class="container"><div class="empty"><div class="h3">Your cart is empty</div><p>Add something before checking out.</p><a class="btn btn-dark" href="#/shop">Go to shop</a></div></div></section>`;
    return `
    <section style="padding-top:calc(env(safe-area-inset-top,0px) + 110px)" class="section-tight">
      <div class="container">
        <div class="crumbs dark"><a href="#/cart">Cart</a> / <span>Checkout</span></div>
        <h1 class="h2 mt-1" style="margin-bottom:22px">Checkout</h1>
        <div class="checkout"><div data-co></div><div>${summary(true)}</div></div>
      </div>
    </section>`;
  };
  EW.views.checkout.mount = root => {
    const host = EW.$('[data-co]', root); if (!host) return;
    const hasPkg = S.cart.some(l => l.type === 'package');
    const steps = () => `<div class="steps">${['Delivery', 'Payment', 'Review'].map((t, k) => `<button class="st ${co.step === k + 1 ? 'on' : co.step > k + 1 ? 'done' : ''}" data-st="${k + 1}"><i>${co.step > k + 1 ? '✓' : k + 1}</i>${t}</button>`).join('')}</div>`;
    const v = k => EW.esc(co.d[k] || '');
    const render = () => {
      if (co.step === 1) host.innerHTML = steps() + `
        <div class="card stack" style="padding:24px">
          <div class="h4">Contact details</div>
          <form class="form-grid" data-f1 novalidate>
            <div class="field"><label>Full name</label><input class="input" name="name" value="${v('name')}" autocomplete="name" required></div>
            <div class="field"><label>Phone (+263)</label><input class="input" name="phone" value="${v('phone')}" placeholder="+263 77 123 4567" autocomplete="tel" required></div>
            <div class="field full"><label>Email</label><input class="input" type="email" name="email" value="${v('email')}" autocomplete="email" required></div>
            <div class="full"><div class="h4" style="margin:10px 0 12px">${hasPkg ? 'Installation address' : 'Delivery method'}</div>
              ${hasPkg ? '' : `<div class="tiles" data-method style="grid-template-columns:1fr 1fr">
                <button type="button" class="tile ${co.method === 'delivery' ? 'on' : ''}" data-v="delivery"><b>${I('truck', 'sm')} Deliver to me</b><span>1–3 days in Harare · 3–5 elsewhere</span></button>
                <button type="button" class="tile ${co.method === 'pickup' ? 'on' : ''}" data-v="pickup"><b>${I('pin', 'sm')} Collect</b><span>EcoWealth warehouse, Harare · Free</span></button></div>`}</div>
            <div class="full form-grid" data-addr ${!hasPkg && co.method === 'pickup' ? 'hidden' : ''} style="gap:14px">
              <div class="field full"><label>Area</label><select class="select" name="zone">${EW.zones.filter(z => z.km).map(z => `<option value="${z.id}" ${S.zone === z.id ? 'selected' : ''}>${z.name} — ${S.subtotal() >= EW.FREE_DELIVERY ? 'Free' : EW.money(EW.deliveryFee(z.km))}</option>`).join('')}</select></div>
              <div class="field full"><label>Street address</label><input class="input" name="addr" value="${v('addr')}" placeholder="House number, street, suburb" autocomplete="street-address"></div>
              <div class="field"><label>City</label><input class="input" name="city" value="${v('city') || 'Harare'}"></div>
              <div class="field"><label>${hasPkg ? 'Preferred install date' : 'Delivery notes'}</label><input class="input" name="note" ${hasPkg ? `type="date" min="${new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10)}"` : 'placeholder="Gate code, landmarks…"'} value="${v('note')}"></div>
            </div>
            <div class="full"><button class="btn btn-dark btn-lg">Continue to payment ${I('arrowR', 'sm arrow')}</button></div>
          </form>
        </div>`;
      if (co.step === 2) host.innerHTML = steps() + `
        <div class="card stack" style="padding:24px">
          ${hasPkg ? `<div class="h4">How would you like to pay?</div>
            <div class="tiles" data-plan style="grid-template-columns:repeat(3,1fr)">
              <button class="tile ${co.plan === 'full' ? 'on' : ''}" data-v="full"><b>Pay in full</b><span>${EW.money(S.total())}</span></button>
              <button class="tile ${co.plan === 'deposit' ? 'on' : ''}" data-v="deposit"><b>20% deposit</b><span>${EW.money(Math.round(S.total() * .2))} now, balance on install</span></button>
              <button class="tile ${co.plan === 'finance' ? 'on' : ''}" data-v="finance"><b>Finance</b><span>From ${EW.money(Math.round(S.total() / 6))}/mo · 0% for 6 months</span></button>
            </div>` : ''}
          <div class="h4">Payment method</div>
          <div class="pay-methods" data-pay>${PAY.map(p => `<button class="tile ${co.pay === p.id ? 'on' : ''}" data-v="${p.id}"><b>${I(p.ic, 'sm')} ${p.name}</b><span>${p.note}</span></button>`).join('')}</div>
          <div data-pay-extra></div>
          <div class="row"><button class="btn btn-outline" data-back>${I('arrowL', 'sm')} Back</button><button class="btn btn-dark btn-lg" data-next>Review order ${I('arrowR', 'sm arrow')}</button></div>
        </div>`;
      if (co.step === 3) {
        const pm = PAY.find(p => p.id === co.pay), due = co.plan === 'deposit' ? Math.round(S.total() * .2) : co.plan === 'finance' ? Math.round(S.total() * .2) : S.total();
        host.innerHTML = steps() + `
        <div class="card stack" style="padding:24px">
          <div class="between"><div class="h4">Contact &amp; ${hasPkg ? 'installation' : 'delivery'}</div><button class="link-btn" data-edit="1">Edit</button></div>
          <div class="small">${v('name')} · ${v('phone')} · ${v('email')}<br>${!hasPkg && co.method === 'pickup' ? 'Collect from EcoWealth warehouse, Harare' : `${v('addr')}, ${v('city')} · ${EW.zones.find(z => z.id === S.zone)?.name}`}${co.d.note ? ' · ' + v('note') : ''}</div>
          <hr class="divider">
          <div class="between"><div class="h4">Payment</div><button class="link-btn" data-edit="2">Edit</button></div>
          <div class="small">${pm.name}${co.d.payPhone ? ' · ' + EW.esc(co.d.payPhone) : ''} · ${co.plan === 'full' ? 'Paying in full' : co.plan === 'deposit' ? '20% deposit, balance on installation' : 'Financing: 20% deposit, then monthly (subject to approval)'}</div>
          <hr class="divider">
          <div class="h4">Items</div>
          ${S.cart.map(l => `<div class="between small"><span style="color:var(--ink)">${l.qty}× ${EW.esc(l.name)}</span><b style="color:var(--ink)">${EW.money(l.price * l.qty)}</b></div>`).join('')}
          <div class="field"><label>Order notes (optional)</label><textarea class="textarea" data-notes placeholder="Anything our team should know">${v('notes')}</textarea></div>
          <label class="check"><input type="checkbox" data-terms> I agree to EcoWealth's terms of sale and installation</label>
          <div class="between" style="background:var(--bg-soft);padding:16px;border-radius:14px"><span>Due now</span><b class="h3">${EW.money(due)}</b></div>
          <div class="row"><button class="btn btn-outline" data-back>${I('arrowL', 'sm')} Back</button><button class="btn btn-green btn-lg" data-place>${I('shield', 'sm')} Place order · ${EW.money(due)}</button></div>
          <p class="tiny" style="margin:0">Demo checkout. No real payment is taken.</p>
        </div>`;
      }
      bind();
    };
    const payExtra = () => {
      const pm = PAY.find(p => p.id === co.pay), box = EW.$('[data-pay-extra]', host);
      box.innerHTML = pm.mobile ? `<div class="field"><label>${pm.name} number</label><input class="input" data-payphone placeholder="07X XXX XXXX" value="${EW.esc(co.d.payPhone || co.d.phone || '')}"><span class="tiny">We'll send a payment prompt to this phone. Enter your PIN to approve it.</span></div>`
        : pm.id === 'card' ? `<div class="form-grid"><div class="field full"><label>Card number</label><input class="input" placeholder="4242 4242 4242 4242" inputmode="numeric" autocomplete="cc-number"></div><div class="field"><label>Expiry</label><input class="input" placeholder="MM/YY" autocomplete="cc-exp"></div><div class="field"><label>CVC</label><input class="input" placeholder="123" inputmode="numeric" autocomplete="cc-csc"></div></div>`
          : pm.id === 'bank' ? `<div class="tip good">${I('info', 'sm')}<span>We'll email our bank details and reserve your stock for 48 hours while the transfer clears.</span></div>`
            : `<div class="tip good">${I('info', 'sm')}<span>You'll be taken to ${pm.name} to finish paying securely.</span></div>`;
    };
    const bind = () => {
      EW.$$('[data-st]', host).forEach(b => b.onclick = () => { const n = +b.dataset.st; if (n < co.step) { co.step = n; render(); } });
      EW.$$('[data-back]', host).forEach(b => b.onclick = () => { co.step--; render(); });
      if (co.step === 1) {
        const f = EW.$('[data-f1]', host);
        EW.$$('[data-method] .tile', host).forEach(b => b.onclick = () => { co.method = b.dataset.v; EW.$$('[data-method] .tile', host).forEach(x => x.classList.toggle('on', x === b)); EW.$('[data-addr]', host).hidden = co.method === 'pickup'; S.zone = co.method === 'pickup' ? 'pickup' : (S.zone === 'pickup' ? 'hre-n' : S.zone); S.save(); refreshSummary(); });
        f.zone.onchange = () => { S.zone = f.zone.value; S.save(); refreshSummary(); };
        f.onsubmit = e => {
          e.preventDefault();
          const needAddr = hasPkg || co.method === 'delivery';
          const checks = { name: x => x.trim().length > 1, phone: x => x.replace(/\D/g, '').length >= 9, email: x => /^\S+@\S+\.\S+$/.test(x), addr: x => !needAddr || x.trim().length > 3 };
          let ok = true;
          EW.$$('.err-msg', f).forEach(x => x.remove());
          Object.entries(checks).forEach(([k, fn]) => { const el = f[k]; const bad = !fn(el.value); el.classList.toggle('err', bad); if (bad) { ok = false; el.insertAdjacentHTML('afterend', `<span class="err-msg">${{ name: 'Please enter your name', phone: 'Enter a valid phone number', email: 'Enter a valid email', addr: 'We need an address to deliver to' }[k]}</span>`); } });
          ['name', 'phone', 'email', 'addr', 'city', 'note'].forEach(k => co.d[k] = f[k]?.value || '');
          if (needAddr) S.zone = f.zone.value;
          S.save();
          if (ok) { co.step = 2; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); } else EW.$('.err', f).focus();
        };
      }
      if (co.step === 2) {
        payExtra();
        EW.$$('[data-plan] .tile', host).forEach(b => b.onclick = () => { co.plan = b.dataset.v; EW.$$('[data-plan] .tile', host).forEach(x => x.classList.toggle('on', x === b)); });
        EW.$$('[data-pay] .tile', host).forEach(b => b.onclick = () => { co.pay = b.dataset.v; EW.$$('[data-pay] .tile', host).forEach(x => x.classList.toggle('on', x === b)); payExtra(); });
        EW.$('[data-next]', host).onclick = () => {
          const pp = EW.$('[data-payphone]', host);
          if (pp) { if (pp.value.replace(/\D/g, '').length < 9) { pp.classList.add('err'); pp.focus(); return; } co.d.payPhone = pp.value; } else co.d.payPhone = '';
          co.step = 3; render();
        };
      }
      if (co.step === 3) {
        EW.$$('[data-edit]', host).forEach(b => b.onclick = () => { co.step = +b.dataset.edit; render(); });
        EW.$('[data-notes]', host).oninput = e => co.d.notes = e.target.value;
        EW.$('[data-place]', host).onclick = e => {
          const t = EW.$('[data-terms]', host);
          if (!t.checked) { t.closest('label').style.color = 'var(--danger)'; EW.toast('Please accept the terms to continue'); return; }
          const btn = e.currentTarget; btn.disabled = true;
          const pm = PAY.find(p => p.id === co.pay);
          btn.innerHTML = pm.mobile ? `${I('phoneSm', 'sm')} Waiting for ${pm.name} approval…` : 'Processing payment…';
          setTimeout(() => placeOrder(), 1800);
        };
      }
    };
    const refreshSummary = () => { const s = EW.$('.order-summary', root); if (s) s.outerHTML = summary(true); };
    const placeOrder = () => {
      const id = 'EW' + Date.now().toString().slice(-6);
      const order = {
        id, date: new Date().toISOString(), items: S.cart.map(l => ({ ...l })), total: S.total(), subtotal: S.subtotal(), delivery: S.delivery(), discount: S.discount(),
        pay: PAY.find(p => p.id === co.pay).name, plan: co.plan, customer: { ...co.d }, method: hasPkg ? 'install' : co.method, zone: S.zone,
      };
      S.orders.unshift(order); S.cart = []; S.coupon = null; S.save();
      co.step = 1;
      EW.go('/order/' + id);
    };
    render();
  };

  /* ---------------- order confirmation / tracking ---------------- */
  EW.views.order = ({ id }) => {
    const o = S.orders.find(x => x.id === id);
    if (!o) return EW.views.notFound();
    const inst = o.method === 'install';
    const ev = inst
      ? [['Order confirmed', 'Payment received. Your order is booked.', 1], ['Site survey', 'An engineer will call within 2 working hours to book a visit.', 0], ['Installation', o.customer.note ? `Preferred date: ${new Date(o.customer.note).toLocaleDateString('en-GB')}` : 'Usually 5–7 days after the survey', 0], ['Commissioned', 'The monitoring app goes live and you get your certificate', 0]]
      : [['Order confirmed', 'Payment received', 1], ['Packed', 'Checked and packed at our Harare warehouse', 0], [o.method === 'pickup' ? 'Ready for collection' : 'Out for delivery', o.method === 'pickup' ? 'We\'ll SMS you when it\'s ready' : 'The driver will call ahead', 0], ['Delivered', '', 0]];
    return `
    <section style="padding-top:calc(env(safe-area-inset-top,0px) + 120px)" class="section-tight">
      <div class="container" style="max-width:880px">
        <div style="text-align:center">
          <div class="success-ring">${I('check')}</div>
          <span class="eyebrow">Order ${o.id}</span>
          <h1 class="h1" style="margin:10px 0">Thank you, ${EW.esc((o.customer.name || 'friend').split(' ')[0])}!</h1>
          <p class="lead" style="margin:0 auto">We've sent a confirmation to <b style="color:var(--ink)">${EW.esc(o.customer.email)}</b> and an SMS to ${EW.esc(o.customer.phone)}.</p>
        </div>
        <div class="grid-2 mt-4" style="align-items:start">
          <div class="card" style="padding:24px"><div class="h4" style="margin-bottom:18px">What happens next</div>
            <div class="timeline">${ev.map(([t, d, done]) => `<div class="ev ${done ? 'done' : ''}"><span class="dot">${done ? I('check', 'sm') : ''}</span><div><b style="font-weight:500">${t}</b><div class="small">${d}</div></div></div>`).join('')}</div></div>
          <div class="card" style="padding:24px"><div class="h4" style="margin-bottom:14px">Receipt</div>
            ${o.items.map(l => `<div class="between small" style="padding:6px 0"><span style="color:var(--ink)">${l.qty}× ${EW.esc(l.name)}</span><span>${EW.money(l.price * l.qty)}</span></div>`).join('')}
            <hr class="divider" style="margin:12px 0">
            <dl class="kv"><dt>Subtotal</dt><dd>${EW.money(o.subtotal)}</dd>${o.discount ? `<dt>Discount</dt><dd>−${EW.money(o.discount)}</dd>` : ''}<dt>Delivery</dt><dd>${o.delivery ? EW.money(o.delivery) : 'Free'}</dd><dt>Paid via</dt><dd>${o.pay}</dd><dt>Plan</dt><dd>${{ full: 'Paid in full', deposit: '20% deposit', finance: 'Financing' }[o.plan]}</dd></dl>
            <hr class="divider" style="margin:12px 0"><div class="between"><b>Total</b><b class="h4">${EW.money(o.total)}</b></div></div>
        </div>
        <div class="row mt-3" style="justify-content:center">
          <a class="btn btn-dark" href="#/shop">Continue shopping</a>
          <a class="btn btn-outline" target="_blank" rel="noopener" href="${EW.waLink(`Hi EcoWealth, following up on order ${o.id}.`)}">${I('whatsapp', 'sm')} WhatsApp support</a>
          <button class="btn btn-ghost" onclick="window.print()">${I('print', 'sm')} Print receipt</button>
        </div>
      </div>
    </section>`;
  };
})();
