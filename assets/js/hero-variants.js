/* Hero variantai: karuselė (V1) ir skonio pasirinkimas (V2). */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- V1: karuselė ---------- */
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

  /* ---------- V2: skonio pasirinkimas ---------- */
  d.querySelectorAll('[data-picker]').forEach(function (root) {
    var stage = root.querySelector('.hv2-stage'), img = stage.querySelector('img');
    var name = root.querySelector('[data-pick-name]'), desc = root.querySelector('[data-pick-desc]');
    var price = root.querySelector('[data-pick-price]'), add = root.querySelector('[data-pick-add]'), badge = root.querySelector('[data-pick-badge]');
    var chips = Array.prototype.slice.call(root.querySelectorAll('.hv2-chip'));
    function pick(chip) {
      chips.forEach(function (c) { c.setAttribute('aria-selected', c === chip ? 'true' : 'false'); });
      var swap = function () {
        img.src = chip.getAttribute('data-img'); img.alt = chip.getAttribute('data-alt') || '';
        name.textContent = chip.getAttribute('data-name'); desc.textContent = chip.getAttribute('data-desc');
        price.textContent = chip.getAttribute('data-price-label');
        add.setAttribute('data-add', chip.getAttribute('data-name')); add.setAttribute('data-price', chip.getAttribute('data-price'));
        if (badge) { var b = chip.getAttribute('data-badge'); badge.textContent = b || ''; badge.hidden = !b; }
      };
      if (reduce) { swap(); return; }
      stage.classList.add('is-switching');
      setTimeout(function () { swap(); stage.classList.remove('is-switching'); }, 220);
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { pick(c); }); });
  });
})();
