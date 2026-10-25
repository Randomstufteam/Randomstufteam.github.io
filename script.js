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
  var copy = document.getElementById('copy-btn'), code = document.getElementById('hash-cmd');
  if (copy && code) copy.addEventListener('click', function () {
    var done = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1800); };
    try { navigator.clipboard.writeText(code.textContent).then(done, function () {}); } catch (e) {}
  });
})();
