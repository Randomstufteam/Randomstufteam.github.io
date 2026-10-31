(function () {
  var root = document.documentElement, KEY = 'remindr-theme', modes = ['system', 'light', 'dark'];
  var btn = document.getElementById('theme-toggle');
  function get() { try { var v = localStorage.getItem(KEY); return modes.indexOf(v) > 0 ? v : 'system'; } catch (e) { return 'system'; } }
  function apply(m) {
    if (m === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', m);
    if (btn) btn.textContent = 'Theme: ' + m.charAt(0).toUpperCase() + m.slice(1);
  }
  var cur = get(); apply(cur);
  if (btn) btn.addEventListener('click', function () {
    var m = cur = modes[(modes.indexOf(cur) + 1) % 3];
    try { localStorage.setItem(KEY, m); } catch (e) {}
    apply(m);
  });
  var items = document.querySelectorAll('.reveal');
  function show(el) { el.classList.add('seen'); }
  // Everything at or above the bottom of the window shows, so a fast scroll or an anchor jump never leaves a section blank.
  function sweep() {
    items.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight * 0.95) show(el); });
  }
  if ('IntersectionObserver' in window) {
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); watcher.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { watcher.observe(el); });
  }
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep);
  window.addEventListener('load', sweep);
  sweep();
  var copy = document.getElementById('copy-btn'), code = document.getElementById('hash-cmd');
  if (copy && code) copy.addEventListener('click', function () {
    var done = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1800); };
    try { navigator.clipboard.writeText(code.textContent).then(done, function () {}); } catch (e) {}
  });
})();
