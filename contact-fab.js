/* Mia June — floating "Contact Us" button (site-wide).
   Include on every page before </body>:  <script src="contact-fab.js" defer></script>
   (from news/ subpages: src="../contact-fab.js")
   Self-contained: injects its own styles + markup. Message links pass
   ?location=… which contact.html reads to pre-select the location dropdown. */
(function () {
  var src = (document.currentScript && document.currentScript.src) || 'contact-fab.js';
  var base = src.replace(/contact-fab\.js.*$/, '');

  var css = [
    '.cfab{position:fixed;right:24px;bottom:24px;z-index:95;font-family:"Inter",sans-serif;}',
    '.cfab-btn{display:flex;align-items:center;gap:10px;padding:15px 26px;background:#2B2622;color:#FDFAF6;',
    '  border:none;cursor:pointer;font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;',
    '  box-shadow:0 12px 34px rgba(43,38,34,.3);transition:background .25s ease,color .25s ease;}',
    '.cfab-btn::before{content:"✦";color:#C4A882;font-size:.8rem;}',
    '.cfab-btn:hover{background:#C4A882;color:#2B2622;}',
    '.cfab-btn:focus-visible{outline:2px solid #C4A882;outline-offset:3px;}',
    '.cfab-panel{position:absolute;right:0;bottom:60px;width:312px;background:#FDFAF6;',
    '  border:1px solid rgba(196,168,130,.45);box-shadow:0 24px 60px rgba(43,38,34,.22);padding:26px 24px 20px;}',
    '.cfab-panel[hidden]{display:none;}',
    '.cfab-title{font-family:"Playfair Display",serif;font-size:1.15rem;color:#2B2622;margin:0 0 4px;}',
    '.cfab-sub{font-size:.64rem;letter-spacing:.18em;text-transform:uppercase;color:#C4A882;margin:0 0 16px;}',
    '.cfab-row{display:flex;justify-content:space-between;align-items:center;gap:12px;',
    '  padding:13px 0;border-top:1px solid rgba(196,168,130,.28);}',
    '.cfab-row a{text-decoration:none;}',
    '.cfab-call{color:#2B2622;display:block;}',
    '.cfab-call b{font-family:"Playfair Display",serif;font-size:.98rem;font-weight:500;display:block;}',
    '.cfab-call span{font-size:.76rem;color:#7A6E66;}',
    '.cfab-call:hover b{color:#C4A882;}',
    '.cfab-msg{font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:#C4A882;white-space:nowrap;}',
    '.cfab-msg:hover{color:#2B2622;}',
    '.cfab-fr{display:flex;justify-content:space-between;align-items:center;padding:13px 0;',
    '  border-top:1px solid rgba(196,168,130,.28);color:#2B2622;text-decoration:none;}',
    '.cfab-fr b{font-family:"Playfair Display",serif;font-size:.98rem;font-weight:500;}',
    '.cfab-fr span{font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:#C4A882;}',
    '.cfab-fr:hover b{color:#C4A882;}',
    '.cfab-all{display:block;text-align:center;margin-top:16px;padding:12px 0;background:#2B2622;color:#FDFAF6;',
    '  font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;transition:background .25s;}',
    '.cfab-all:hover{background:#C4A882;color:#2B2622;}',
    '@media(max-width:600px){.cfab{right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));}',
    '  .cfab-btn{padding:14px 22px;}.cfab-panel{width:calc(100vw - 32px);max-width:340px;}}'
  ].join('\n');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function row(name, telHuman, telLink, locParam) {
    return '<div class="cfab-row">' +
      '<a class="cfab-call" href="tel:' + telLink + '"><b>' + name + '</b><span>' + telHuman + '</span></a>' +
      '<a class="cfab-msg" href="' + base + 'contact.html?location=' + locParam + '">Message →</a>' +
      '</div>';
  }

  var wrap = document.createElement('div');
  wrap.className = 'cfab';
  wrap.innerHTML =
    '<button class="cfab-btn" type="button" aria-expanded="false" aria-controls="cfab-panel">Contact Us</button>' +
    '<div class="cfab-panel" id="cfab-panel" hidden>' +
    '<p class="cfab-title">We’d love to hear from you.</p>' +
    '<p class="cfab-sub">Choose your location</p>' +
    row('Birmingham, AL', '(205) 260-2812', '+12052602812', 'Birmingham%2C%20AL') +
    row('Pelham, AL', '(205) 728-8899', '+12057288899', 'Pelham%2C%20AL') +
    row('Oxford, MS', '(662) 801-5863', '+16628015863', 'Oxford%2C%20MS') +
    '<a class="cfab-fr" href="' + base + 'franchise.html#franchise-inquiry"><b>Franchise Inquiry</b><span>Own a Mia June →</span></a>' +
    '<a class="cfab-all" href="' + base + 'contact.html">Send us a message</a>' +
    '</div>';
  document.body.appendChild(wrap);

  var btn = wrap.querySelector('.cfab-btn'), panel = wrap.querySelector('.cfab-panel');
  function setOpen(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open);
  }
  btn.addEventListener('click', function () { setOpen(panel.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) setOpen(false); });
})();
