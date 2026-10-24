/* Shortbarrel on Shopify, with the AccelPay Shopify app. Static demo layer.
 *
 * WHAT THIS SHOWS
 * The brand's store already runs on Shopify. The pitch is that the AccelPay
 * Shopify app plugs into that store: the theme, the Shopify cart drawer and the
 * Shopify one-page checkout stay as they are, and AccelPay handles payments,
 * taxes and routing each order to a licensed retailer. No third-party cart.
 *
 * This file renders Shopify-theme pieces only: a product form with an AccelPay
 * availability app block (ZIP check, retailer pick, Gopuff delivery where it is
 * real), a theme cart drawer with accelerated checkout buttons, and a
 * Shopify-style checkout with express checkout (Shop Pay, Apple Pay, Google Pay)
 * and card. The express buttons only continue the demo flow.
 *
 * WHAT IS REAL AND WHAT IS NOT: see data.js and README.md. Named retailers,
 * their prices and Gopuff ZIPs are real. "Licensed retailer in <state>" routes
 * are illustrative (the retailer is connected at launch) and use the current
 * site price. No order is placed and no card is charged.
 */
(function () {
  'use strict';

  const D = window.DEMO_DATA;
  const CATALOG = D.CATALOG;
  const RETAILERS = D.RETAILERS;
  const VARIANTS = D.VARIANTS;
  const GOPUFF_ZIPS = new Set(D.GOPUFF_ZIPS || []);
  const NO_SHIP = new Set(D.NO_SHIP || []);
  const TRY = D.TRY_ZIPS || '10007, 77006 or 90046';
  const MAX_QTY = 12;

  const STATE_NAMES = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DC:'Washington DC',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};
  const ZIP3 = [[5,5,'NY'],[10,27,'MA'],[28,29,'RI'],[30,38,'NH'],[39,49,'ME'],[50,54,'VT'],[55,55,'MA'],[56,59,'VT'],
    [60,69,'CT'],[70,89,'NJ'],[100,149,'NY'],[150,196,'PA'],[197,199,'DE'],[200,200,'DC'],[201,201,'VA'],[202,205,'DC'],
    [206,219,'MD'],[220,246,'VA'],[247,268,'WV'],[270,289,'NC'],[290,299,'SC'],[300,319,'GA'],[320,349,'FL'],[350,369,'AL'],
    [370,385,'TN'],[386,397,'MS'],[398,399,'GA'],[400,427,'KY'],[430,459,'OH'],[460,479,'IN'],[480,499,'MI'],[500,528,'IA'],
    [530,549,'WI'],[550,567,'MN'],[569,569,'DC'],[570,577,'SD'],[580,588,'ND'],[590,599,'MT'],[600,629,'IL'],[630,658,'MO'],
    [660,679,'KS'],[680,693,'NE'],[700,714,'LA'],[716,729,'AR'],[730,749,'OK'],[750,799,'TX'],[800,816,'CO'],[820,831,'WY'],
    [832,838,'ID'],[840,847,'UT'],[850,865,'AZ'],[870,884,'NM'],[885,885,'TX'],[889,898,'NV'],[900,961,'CA'],[967,968,'HI'],
    [970,979,'OR'],[980,994,'WA'],[995,999,'AK']];
  function stateForZip(zip) {
    const n = parseInt(zip.slice(0, 3), 10);
    for (const [a, b, s] of ZIP3) if (n >= a && n <= b) return s;
    return null;
  }

  // ---------------------------------------------------------------- state
  const LS = D.STORAGE_KEY || 'accelpay-shopify-demo';
  const state = load() || { zip: null, st: null, items: [] };
  function load() { try { return JSON.parse(localStorage.getItem(LS)); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {} }

  const money = c => '$' + (c / 100).toFixed(2);
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

  // Retailer lookup. 'lic-XX' is the illustrative "licensed retailer in <state>" route.
  function R(rid) {
    if (RETAILERS[rid]) return RETAILERS[rid];
    const m = /^lic-([A-Z]{2})$/.exec(rid || '');
    if (m) return { name: 'Licensed retailer in ' + (STATE_NAMES[m[1]] || m[1]), city: 'Connected at launch', state: m[1], type: 'shipping', illustrative: true };
    return null;
  }
  function sellable(id) { const p = CATALOG[id]; return !!p && (!p.soldOutOnSite || (VARIANTS[id] || []).length > 0); }
  function options(id, type) {
    if (!state.zip) return [];
    const real = (VARIANTS[id] || [])
      .map(v => Object.assign({ retailerId: v.r }, R(v.r), v))
      .filter(v => v.retailerId === 'gopuff' ? GOPUFF_ZIPS.has(state.zip) : v.state === state.st);
    const hasShip = real.some(v => v.type === 'shipping');
    if (!hasShip && sellable(id) && !NO_SHIP.has(state.st) && CATALOG[id].sitePrice) {
      real.push(Object.assign({ retailerId: 'lic-' + state.st, price: CATALOG[id].sitePrice, stock: MAX_QTY }, R('lic-' + state.st)));
    }
    return real.filter(v => !type || v.type === type).sort((a, b) => a.price - b.price);
  }
  function inNetwork(id) { return (VARIANTS[id] || []).some(v => v.r !== 'gopuff'); }
  function priceFor(id, rid) {
    const v = (VARIANTS[id] || []).filter(x => x.r === rid)[0];
    return v ? v.price : (CATALOG[id].sitePrice || 0);
  }
  function lowestPrice(id) {
    const vs = (VARIANTS[id] || []).filter(v => v.r !== 'gopuff');
    return vs.length ? Math.min.apply(null, vs.map(v => v.price)) : null;
  }
  function networkStates(id) {
    return Array.from(new Set((VARIANTS[id] || []).map(v => (R(v.r) || {}).state).filter(s => s && s !== '*'))).sort();
  }
  function itemOk(i) {
    if (i.retailerId === 'gopuff') return GOPUFF_ZIPS.has(state.zip);
    const r = R(i.retailerId); return !!r && r.state === state.st;
  }
  function setZip(raw) {
    const m = (raw || '').match(/\b(\d{5})\b/);
    if (!m) return false;
    const st = stateForZip(m[1]); if (!st) return false;
    state.zip = m[1]; state.st = st;
    state.items = state.items.filter(itemOk);
    pstate.rid = null; pstate.mode = 'delivery';
    save(); renderAll(); return true;
  }

  // ---------------------------------------------------------------- cart
  function groups() {
    const map = {};
    state.items.forEach(i => {
      const r = R(i.retailerId);
      if (!CATALOG[i.id] || !r) return;
      (map[i.retailerId] = map[i.retailerId] || { rid: i.retailerId, r: r, items: [], sub: 0 });
      map[i.retailerId].items.push(i); map[i.retailerId].sub += priceFor(i.id, i.retailerId) * i.qty;
    });
    return Object.keys(map).map(k => map[k]);
  }
  function totals() {
    let sub = 0, n = 0;
    state.items.forEach(i => { if (!CATALOG[i.id]) return; sub += priceFor(i.id, i.retailerId) * i.qty; n += i.qty; });
    return { sub, n };
  }
  function addItem(id, rid, qty) {
    const key = id + '::' + rid;
    const it = state.items.filter(i => i.key === key)[0];
    if (it) it.qty = Math.min(MAX_QTY, it.qty + qty); else state.items.push({ key, id, retailerId: rid, qty });
    save(); renderAll(); openDrawer();
  }
  function setQty(key, d) {
    const it = state.items.filter(i => i.key === key)[0]; if (!it) return;
    it.qty = Math.min(MAX_QTY, it.qty + d);
    if (it.qty < 1) state.items = state.items.filter(i => i.key !== key);
    save(); renderAll();
  }

  // ---------------------------------------------------------------- product form (theme) + AccelPay app block
  const pstate = { id: null, mode: 'delivery', rid: null, qty: 1 };

  function renderProduct() {
    const host = $('#product-form'); if (!host) return;
    const id = host.getAttribute('data-product');
    const p = CATALOG[id]; if (!p) { host.innerHTML = '<p>Product not found.</p>'; return; }
    if (pstate.id !== id) { pstate.id = id; pstate.qty = 1; pstate.rid = null; pstate.mode = 'delivery'; }
    const ok = sellable(id);
    const od = options(id, 'onDemand'), sh = options(id, 'shipping');
    if (state.zip && pstate.mode === 'delivery' && !od.length) pstate.mode = 'ship';
    const rs = pstate.mode === 'delivery' ? od : sh;
    if (!rs.filter(x => x.retailerId === pstate.rid)[0]) pstate.rid = (rs[0] || {}).retailerId || null;
    const r = rs.filter(x => x.retailerId === pstate.rid)[0] || null;
    const low = lowestPrice(id);
    const price = r ? money(r.price) : (p.sitePrice ? money(p.sitePrice) : (low ? 'From ' + money(low) : ''));
    const gpAny = (VARIANTS[id] || []).some(v => v.r === 'gopuff');

    let block;
    if (!ok) {
      block = '<div class="ap-msg">Sold out on the current store and not stocked by a network retailer today.</div>';
    } else if (!state.zip) {
      block = '<label class="ap-lbl" for="ap-zip">Check availability near you</label><div class="ap-row"><input id="ap-zip" inputmode="numeric" placeholder="ZIP code, e.g. ' + TRY.split(',')[0] + '" autocomplete="postal-code"><button type="button" id="ap-go">Check</button></div>' +
        '<div class="ap-hint">Sold and fulfilled by a licensed retailer that can serve your address.</div>';
    } else {
      block = '<div class="ap-zipline">Delivering to <b>' + state.zip + ', ' + state.st + '</b> <button type="button" id="ap-chg">Change</button></div>' +
        ((gpAny || od.length) && (od.length || sh.length) ? '<div class="ap-modes">' +
          '<button type="button" data-mode="delivery" aria-pressed="' + (pstate.mode === 'delivery') + '"' + (od.length ? '' : ' disabled') + '><img src="assets/gopuff-icon.png" alt=""><span><b>Delivery</b><small>' + (od.length ? 'About 30 minutes via Gopuff' : 'Not at this ZIP yet') + '</small></span></button>' +
          '<button type="button" data-mode="ship" aria-pressed="' + (pstate.mode === 'ship') + '"' + (sh.length ? '' : ' disabled') + '><span class="lic">LIC</span><span><b>Ship</b><small>' + (sh.length ? 'From a licensed retailer in ' + state.st : 'No in-state retailer yet') + '</small></span></button></div>' : '') +
        (rs.length ? '<div class="ap-list">' + rs.map(x => '<label class="ap-opt' + (x.retailerId === pstate.rid ? ' on' : '') + '"><input type="radio" name="ap-r" value="' + x.retailerId + '"' + (x.retailerId === pstate.rid ? ' checked' : '') + '>' +
            '<span class="nm">' + x.name + '<small>' + (x.retailerId === 'gopuff' ? 'About 30 minutes · ' + state.zip : x.city) + (!x.illustrative && x.stock <= 10 && x.retailerId !== 'gopuff' ? ' · ' + x.stock + ' left' : '') + '</small></span><span class="pr">' + money(x.price) + '</span></label>').join('') + '</div>'
          : '<div class="ap-msg">' + (NO_SHIP.has(state.st) ? 'We cannot ship spirits to ' + (STATE_NAMES[state.st] || state.st) + ' today.' : 'No route to ' + state.st + ' yet.') + (inNetwork(id) ? ' In stock now at network retailers in ' + networkStates(id).join(', ') + '.' : '') + ' Try ' + TRY + '.</div>') +
        (r && r.illustrative ? '<div class="ap-hint">At launch this goes to a licensed retailer in ' + (STATE_NAMES[state.st] || state.st) + ' from the AccelPay network. Price shown is today\'s site price.</div>' : '');
    }

    host.innerHTML = [
      '<p class="pdp-vendor">', p.line, '</p>',
      '<h1 class="pdp-title">', p.name, '</h1>',
      '<p class="pdp-price">', price, '</p>',
      '<p class="pdp-tax">Shipping and taxes calculated at checkout. Licensed retailers set the final price.</p>',
      p.soldOutOnSite && inNetwork(id) ? '<p class="pdp-flag">Sold out on the current store. In stock today at a licensed retailer in the network (' + networkStates(id).join(', ') + ').</p>' : '',
      '<div class="ap-block"><div class="ap-head"><span>Availability</span><span class="ap-by">AccelPay app</span></div>', block, '</div>',
      '<div class="pdp-qty"><span>Quantity</span><div class="qty"><button type="button" id="qm" aria-label="Decrease">&minus;</button><span>', pstate.qty, '</span><button type="button" id="qp" aria-label="Increase">+</button></div></div>',
      '<button type="button" class="btn block pdp-add" id="add"', ok && (!state.zip || r) ? '' : ' disabled', '>',
        !ok ? 'Sold out' : (!state.zip ? 'Check availability' : (r ? 'Add to cart' : 'Not available near you')), '</button>',
      '<div class="pdp-desc">', p.desc, '</div>',
      D.RB_URL ? '<p class="rb-note">Also on <a href="' + D.RB_URL + '" target="_blank" rel="noopener">ReserveBar.com</a>, for gifting and corporate orders.</p>' : ''
    ].join('');

    const go = $('#ap-go', host), zi = $('#ap-zip', host);
    if (go) { const f = () => { if (!setZip(zi.value)) { zi.classList.add('err'); zi.focus(); } }; go.onclick = f; zi.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); f(); } }; }
    const chg = $('#ap-chg', host); if (chg) chg.onclick = () => { state.zip = null; state.st = null; save(); renderAll(); };
    $$('[data-mode]', host).forEach(b => b.onclick = () => { pstate.mode = b.getAttribute('data-mode'); pstate.rid = null; renderProduct(); });
    $$('input[name="ap-r"]', host).forEach(i => i.onchange = () => { pstate.rid = i.value; renderProduct(); });
    $('#qm', host).onclick = () => { if (pstate.qty > 1) { pstate.qty--; renderProduct(); } };
    $('#qp', host).onclick = () => { const cap = Math.min(MAX_QTY, r && !r.illustrative ? r.stock : MAX_QTY); if (pstate.qty < cap) { pstate.qty++; renderProduct(); } };
    $('#add', host).onclick = () => {
      if (!state.zip) { const z = $('#ap-zip', host); if (z && z.value) setZip(z.value); else if (z) z.focus(); return; }
      if (pstate.rid) addItem(pstate.id, pstate.rid, pstate.qty);
    };
  }

  // ---------------------------------------------------------------- theme cart drawer
  function openDrawer() { const d = $('#drawer'); if (!d) return; d.classList.add('on'); $('#scrim').classList.add('on'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { const d = $('#drawer'); if (!d) return; d.classList.remove('on'); $('#scrim').classList.remove('on'); document.body.style.overflow = ''; }
  function routeLabel(i) {
    const r = R(i.retailerId);
    return i.retailerId === 'gopuff' ? 'Delivery in about 30 minutes' : (r.illustrative ? 'Ships from a licensed retailer in ' + r.state : 'Ships from ' + r.name);
  }
  function renderDrawer() {
    const box = $('#drawer-items'); if (!box) return;
    const t = totals();
    const live = state.items.filter(i => CATALOG[i.id] && R(i.retailerId));
    box.innerHTML = live.length ? live.map(i => {
      const p = CATALOG[i.id];
      return '<div class="cd-line"><img src="' + p.image + '" alt=""><div class="cd-info"><a href="product.html?p=' + i.id + '">' + p.name + '</a>' +
        '<small>' + p.size + ' · ' + routeLabel(i) + '</small>' +
        '<div class="cd-row"><div class="qty"><button data-q="-1" data-k="' + i.key + '">&minus;</button><span>' + i.qty + '</span><button data-q="1" data-k="' + i.key + '">+</button></div>' +
        '<span class="cd-pr">' + money(priceFor(i.id, i.retailerId) * i.qty) + '</span></div></div></div>';
    }).join('') : '<div class="empty">Your cart is empty<br><a class="btn" href="index.html#shop" style="margin-top:1rem">Continue shopping</a></div>';
    const foot = $('#drawer-foot');
    if (foot) foot.innerHTML = live.length ? '<div class="cd-sub"><span>Estimated total</span><b>' + money(t.sub) + ' USD</b></div>' +
      '<p class="cd-tax">Taxes, discounts and shipping calculated at checkout.</p><a class="btn block" href="checkout.html">Check out</a><div class="xp-row cd-xp"><a class="xpb shoppay" href="checkout.html" aria-label="Shop Pay"><span class="sp-shop">shop</span><span class="sp-pay">Pay</span></a><a class="xpb applepay" href="checkout.html" aria-label="Apple Pay"><span class="apl">&#63743;</span><span>Pay</span></a><a class="xpb gpay" href="checkout.html" aria-label="Google Pay"><span class="g"><b style="color:#4285f4">G</b></span><span>Pay</span></a></div>' : '';
    $$('[data-q]', box).forEach(b => b.onclick = () => setQty(b.getAttribute('data-k'), parseInt(b.getAttribute('data-q'), 10)));
    $$('[data-cart-count]').forEach(el => { el.textContent = t.n; el.hidden = !t.n; });
  }

  // ---------------------------------------------------------------- Shopify-style checkout
  function renderCheckout() {
    const side = $('#co-summary'); if (!side) return;
    const t = totals(), gs = groups();
    side.innerHTML = (state.items.length ? state.items.filter(i => CATALOG[i.id]).map(i => {
      const p = CATALOG[i.id];
      return '<div class="os-item"><div class="im"><img src="' + p.image + '" alt=""><span class="q">' + i.qty + '</span></div>' +
        '<div class="nm"><div class="t">' + p.name + '</div><div class="s">' + p.size + '</div></div><div class="pr">' + money(priceFor(i.id, i.retailerId) * i.qty) + '</div></div>';
    }).join('') : '<p style="color:var(--gray)">Your cart is empty. <a href="index.html#shop">Continue shopping</a></p>') +
      '<div class="co-discount"><input placeholder="Discount code or gift card" aria-label="Discount code"><button type="button">Apply</button></div>' +
      '<div class="os-line"><span>Subtotal</span><span>' + money(t.sub) + '</span></div>' +
      '<div class="os-line"><span>Shipping</span><span class="muted">' + (gs.length ? 'Set by retailer' : 'Enter shipping address') + '</span></div>' +
      '<div class="os-line"><span>Estimated taxes <span class="ap-tag">AccelPay</span></span><span class="muted">Calculated for ' + (state.st || 'your state') + '</span></div>' +
      '<div class="os-line total"><span>Total</span><span><small>USD</small> ' + money(t.sub) + '</span></div>' +
      '<p class="os-fine">Demo total excludes shipping and tax. Each item is sold by the licensed retailer shown at shipping.</p>';

    const ship = $('#ship-methods');
    if (ship) ship.innerHTML = gs.length ? gs.map(g => {
      const n = g.items.reduce((a, i) => a + i.qty, 0);
      return '<div class="sh-opt"><span class="radio on"></span>' +
        (g.r.logo ? '<img class="ret" src="' + g.r.logo + '" alt="Gopuff">' : '<span class="ret lic">LIC</span>') +
        '<span class="body"><span class="n">' + (g.rid === 'gopuff' ? 'Delivery in about 30 minutes via Gopuff' : 'Standard shipping from ' + (g.r.illustrative ? 'a licensed retailer in ' + (STATE_NAMES[g.r.state] || g.r.state) : g.r.name)) + '</span>' +
        '<span class="d">' + n + ' item' + (n === 1 ? '' : 's') + ' · ' + (g.rid === 'gopuff' ? 'From a Gopuff near ' + state.zip + ' · ID check at the door' : (g.r.illustrative ? 'Retailer assigned by AccelPay at launch' : 'Licensed retailer in ' + g.r.city) + ' · adult signature required') + '</span></span>' +
        '<span class="amt">Set by retailer</span></div>';
    }).join('') + (gs.length > 1 ? '<p class="ap-note"><b>AccelPay routing:</b> your cart is split across ' + gs.length + ' licensed retailers. One checkout, one payment, and the order stays in Shopify.</p>' : '')
      : '<p class="muted">Add something to your cart to see shipping options.</p>';

    const zip = $('input[name="zip"]'), st = $('select[name="state"]');
    if (state.zip && zip && !zip.value) { zip.value = state.zip; if (st) st.value = state.st; }
    const pay = $('#pay-now'); if (pay) pay.disabled = !state.items.length;
  }
  function placeOrder() {
    const t = totals(), names = groups().map(g => g.rid === 'gopuff' ? 'Gopuff' : (g.r.illustrative ? 'a licensed retailer in ' + g.r.state : g.r.name));
    try { sessionStorage.setItem(LS + '-order', JSON.stringify({ n: 'DEMO-' + Math.floor(100000 + Math.random() * 899999), total: t.sub, retailers: names })); } catch (err) {}
    state.items = []; save(); location.href = 'checkout.html?confirmed=1';
  }
  function wireCheckout() {
    const form = $('#co-form'); if (!form) return;
    form.addEventListener('submit', function (e) { e.preventDefault(); placeOrder(); });
    $$('[data-express]').forEach(b => b.addEventListener('click', function () { if (state.items.length) placeOrder(); }));
    const zip = $('input[name="zip"]');
    if (zip) zip.addEventListener('change', () => { if (setZip(zip.value)) { const st = $('select[name="state"]'); if (st) st.value = state.st; } });
  }

  function renderAll() { renderProduct(); renderDrawer(); renderCheckout(); }

  function boot() {
    $$('[data-cart-toggle]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openDrawer(); }));
    const x = $('#drawer-close'); if (x) x.addEventListener('click', closeDrawer);
    const s = $('#scrim'); if (s) s.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    const burger = $('#burger'); if (burger) burger.addEventListener('click', () => $('nav.main').classList.toggle('open'));
    wireCheckout();
    renderAll();
  }

  window.DemoApp = {
    catalog: CATALOG, retailers: RETAILERS, variants: VARIANTS, R: R, stateNames: STATE_NAMES,
    lowestPrice, inNetwork, networkStates, setZip, openDrawer, sellable, options,
    zip: () => state.zip, st: () => state.st, orderKey: LS + '-order'
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
