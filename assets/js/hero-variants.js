/* Hero variantai: karuselė (V1) ir skonio pasirinkimas (V2). */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
