/* NAMIKO – demo sąveikos (be priklausomybių). Gerbia prefers-reduced-motion. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmt = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };

  /* ---------- Scroll reveal ---------- */
  var rv = Array.prototype.slice.call(d.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
    /* Atsarginis variantas: jei IO neiššauna (seni/įterpti naršyklių režimai), tikriname pagal scroll */
    var pending = false;
    var sweep = function () {
      pending = false;
      var h = window.innerHeight || root.clientHeight;
      rv.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < h * 0.96 && r.bottom > 0) { el.classList.add('is-in'); io.unobserve(el); }
      });
    };
    var onScroll = function () { if (!pending) { pending = true; requestAnimationFrame(sweep); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', function () { setTimeout(sweep, 300); });
  } else { rv.forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------- Mobilus meniu ---------- */
  var drawer = d.querySelector('[data-drawer]');
  function closeDrawer() { if (drawer) { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); d.body.style.overflow = ''; } }
  d.querySelectorAll('[data-drawer-open]').forEach(function (b) { b.addEventListener('click', function () { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); d.body.style.overflow = 'hidden'; }); });
  d.querySelectorAll('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* ---------- Aktyvus meniu punktas ---------- */
  var page = location.pathname.split('/').pop() || 'index.html';
  d.querySelectorAll('.nav-list a').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (h === page || (page === 'index.html' && h === 'index.html')) a.classList.add('is-active');
  });

  /* ---------- Demo krepšelis (localStorage) ---------- */
  var store = {
    get: function () { try { return JSON.parse(localStorage.getItem('namiko_cart') || '{"count":0,"total":0}'); } catch (e) { return { count: 0, total: 0 }; } },
    set: function (v) { try { localStorage.setItem('namiko_cart', JSON.stringify(v)); } catch (e) {} }
  };
  function renderCart() {
    var c = store.get();
    d.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = c.count; });
    d.querySelectorAll('[data-cart-total]').forEach(function (el) { el.textContent = fmt(c.total); });
  }
  renderCart();

  var toast = d.querySelector('[data-toast]'), tt;
  function showToast(html) {
    if (!toast) return;
    toast.querySelector('[data-toast-text]').innerHTML = html;
    toast.classList.add('is-visible');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-visible'); }, 3400);
  }

  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    e.preventDefault();
    var wrap = b.closest('[data-buy]');
    var qtyEl = wrap ? wrap.querySelector('.qty input') : null;
    var q = qtyEl ? Math.max(1, parseInt(qtyEl.value, 10) || 1) : 1;
    var price = parseFloat(b.getAttribute('data-price') || '0');
    var c = store.get();
    c.count += q; c.total = +(c.total + price * q).toFixed(2);
    store.set(c); renderCart();
    showToast('<b>' + b.getAttribute('data-add') + '</b> įdėta į krepšelį. <a href="pirkimas.html">Užsakyti →</a>');
    var old = b.innerHTML;
    b.innerHTML = '<svg class="icon"><use href="#i-check"></use></svg> Įdėta';
    setTimeout(function () { b.innerHTML = old; }, 1600);
  });

  /* ---------- Norų sąrašas ---------- */
  var wish = 0;
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-wish]');
    if (!b) return;
    e.preventDefault();
    b.classList.toggle('is-on');
    wish += b.classList.contains('is-on') ? 1 : -1;
    d.querySelectorAll('[data-wish-count]').forEach(function (el) { el.textContent = Math.max(0, wish); });
    b.querySelector('svg').style.fill = b.classList.contains('is-on') ? 'currentColor' : 'none';
  });

  /* ---------- Kiekio mygtukai ---------- */
  d.addEventListener('click', function (e) {
    var b = e.target.closest('.qty button');
    if (!b) return;
    var i = b.parentElement.querySelector('input');
    var v = Math.max(1, (parseInt(i.value, 10) || 1) + (b.getAttribute('data-dir') === '-' ? -1 : 1));
    i.value = v;
    i.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---------- Skirtukai (tabs) ---------- */
  d.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) {
          var on = x === t;
          x.setAttribute('aria-selected', on ? 'true' : 'false');
          var p = d.getElementById(x.getAttribute('aria-controls'));
          if (p) p.classList.toggle('is-active', on);
        });
      });
    });
  });
  d.querySelectorAll('[data-tab-link]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = d.getElementById(a.getAttribute('data-tab-link'));
      if (t) { t.click(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    });
  });

  /* ---------- Galerija ---------- */
  var main = d.querySelector('[data-gallery-main]');
  d.querySelectorAll('.thumb').forEach(function (t) {
    t.addEventListener('click', function () {
      d.querySelectorAll('.thumb').forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
      if (main) {
        main.style.opacity = 0;
        setTimeout(function () { main.src = t.getAttribute('data-src'); main.alt = t.getAttribute('data-alt') || ''; main.style.opacity = 1; }, 150);
      }
    });
  });

  /* ---------- Pakuotės pasirinkimas (prekės puslapis) ---------- */
  var packs = d.querySelectorAll('input[name="pack"]');
  if (packs.length) {
    var upd = function () {
      var p = Array.prototype.filter.call(packs, function (x) { return x.checked; })[0];
      if (!p) return;
      var price = parseFloat(p.getAttribute('data-price')), old = p.getAttribute('data-old');
      d.querySelectorAll('[data-price-main]').forEach(function (el) { el.textContent = fmt(price); });
      d.querySelectorAll('[data-price-old]').forEach(function (el) { el.textContent = old ? fmt(parseFloat(old)) : ''; el.hidden = !old; });
      d.querySelectorAll('[data-per-day]').forEach(function (el) { el.textContent = p.getAttribute('data-per-day'); });
      d.querySelectorAll('[data-pack-label]').forEach(function (el) { el.textContent = p.getAttribute('data-label'); });
      d.querySelectorAll('[data-add-main]').forEach(function (b) { b.setAttribute('data-price', price); b.setAttribute('data-add', p.getAttribute('data-name')); });
    };
    packs.forEach(function (p) { p.addEventListener('change', upd); });
    upd();
  }

  /* ---------- Lipni „į krepšelį“ juosta ---------- */
  var sticky = d.querySelector('.sticky-cart'), anchor = d.querySelector('[data-sticky-anchor]');
  if (sticky && anchor && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { sticky.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0); });
    }).observe(anchor);
  }

  /* ---------- Hero karuselė (XStore slider) ---------- */
  d.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hv1-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.hv1-dot'));
    var counter = root.querySelector('[data-counter]');
    var i = 0, timer = null, userTouched = false;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      dots.forEach(function (dot, k) { dot.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      if (counter) counter.textContent = (i + 1) + ' / ' + slides.length;
    }
    function play() { if (reduce || userTouched) return; stop(); timer = setInterval(function () { show(i + 1); }, 6000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    root.querySelectorAll('[data-dir]').forEach(function (b) {
      b.addEventListener('click', function () { userTouched = true; stop(); show(i + (b.getAttribute('data-dir') === '-' ? -1 : 1)); });
    });
    dots.forEach(function (dot, k) { dot.addEventListener('click', function () { userTouched = true; stop(); show(k); }); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop);
    show(0); play();
  });

  /* ---------- Judanti privalumų juosta (marquee) ---------- */
  d.querySelectorAll('[data-marquee]').forEach(function (m) {
    var track = m.querySelector('.marquee-track'), list = track && track.querySelector('.usp-list');
    if (!track || !list || reduce) return;
    var clone = list.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a,button').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
    track.appendChild(clone);
    var setSpeed = function () {
      var w = list.getBoundingClientRect().width + 14; /* sąrašo plotis + tarpas */
      track.style.setProperty('--marquee-duration', Math.max(18, w / 60) + 's'); /* ~60 px/s */
    };
    setSpeed();
    window.addEventListener('resize', setSpeed);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(setSpeed);
  });

  /* ---------- Horizontalus slinkiklis ---------- */
  d.querySelectorAll('[data-scroller]').forEach(function (s) {
    var id = s.getAttribute('data-scroller');
    d.querySelectorAll('[data-scroll-for="' + id + '"]').forEach(function (b) {
      b.addEventListener('click', function () {
        s.scrollBy({ left: (b.getAttribute('data-dir') === '-' ? -1 : 1) * s.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* ---------- Pirkimo procesas ---------- */
  var co = d.querySelector('[data-checkout]');
  if (co) {
    var FREE = 35;
    var calc = function () {
      var sub = 0, oldSum = 0, count = 0;
      co.querySelectorAll('[data-line]').forEach(function (li) {
        var q = parseInt(li.querySelector('.qty input').value, 10) || 1;
        var p = parseFloat(li.getAttribute('data-price')), o = parseFloat(li.getAttribute('data-old') || li.getAttribute('data-price'));
        sub += p * q; oldSum += o * q; count += q;
        li.querySelector('[data-line-total]').textContent = fmt(p * q);
        var ot = li.querySelector('[data-line-old]');
        if (ot) ot.textContent = o > p ? fmt(o * q) : '';
        li.querySelector('[data-line-count]').textContent = q;
      });
      var free = sub >= FREE;
      var ship = co.querySelector('input[name="ship"]:checked');
      var fee = ship ? parseFloat(ship.getAttribute('data-fee')) : 0;
      var shipCost = (free && ship && ship.getAttribute('data-freeable') === '1') ? 0 : fee;
      co.querySelector('[data-subtotal]').textContent = fmt(sub);
      var disc = oldSum - sub, dl = co.querySelector('[data-discount-line]');
      if (dl) { dl.hidden = disc <= 0.001; co.querySelector('[data-discount]').textContent = '−' + fmt(disc); }
      var se = co.querySelector('[data-shipping]');
      se.textContent = shipCost === 0 ? 'Nemokamas' : fmt(shipCost);
      se.classList.toggle('free', shipCost === 0);
      co.querySelector('[data-total]').textContent = fmt(sub + shipCost);
      co.querySelectorAll('[data-pay-total]').forEach(function (el) { el.textContent = fmt(sub + shipCost); });
      var bar = co.querySelector('[data-ship-bar]'), msg = co.querySelector('[data-ship-msg]');
      bar.style.setProperty('--w', Math.min(100, sub / FREE * 100) + '%');
      msg.innerHTML = free ? '<svg class="icon"><use href="#i-check"></use></svg> Nemokamas pristatymas pritaikytas' : 'Iki nemokamo pristatymo trūksta <strong>' + fmt(FREE - sub) + '</strong>';
      co.querySelectorAll('[data-fee-label]').forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-fee')), isFree = free && el.getAttribute('data-freeable') === '1';
        el.textContent = f === 0 ? 'Nemokamai' : (isFree ? 'Nemokamai' : fmt(f));
        el.classList.toggle('is-free', isFree || f === 0);
      });
      d.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = count; });
      d.querySelectorAll('[data-cart-total]').forEach(function (el) { el.textContent = fmt(sub); });
      store.set({ count: count, total: +sub.toFixed(2) });
    };
    co.addEventListener('change', calc);
    co.addEventListener('input', calc);
    co.querySelectorAll('[data-remove]').forEach(function (b) { b.addEventListener('click', function () { b.closest('[data-line]').remove(); calc(); }); });
    calc();
    var form = co.querySelector('form[data-checkout-form]');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      co.querySelector('[data-checkout-main]').hidden = true;
      co.querySelector('[data-checkout-side]').hidden = true;
      co.querySelector('[data-checkout-done]').hidden = false;
      d.querySelectorAll('.cstep').forEach(function (s) { s.classList.remove('is-current'); s.classList.add('is-done'); });
      d.querySelectorAll('.cstep-line').forEach(function (l) { l.classList.add('is-done'); });
      store.set({ count: 0, total: 0 });
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();
