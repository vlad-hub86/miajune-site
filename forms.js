/* forms.js — progressive AJAX submit for the site's Formspree forms.
   Posts via fetch with `Accept: application/json` and swaps in an inline
   branded thank-you, so no redirect (works on the Formspree free plan and
   keeps visitors on the page). Without JS, forms fall back to a normal
   POST and Formspree's hosted confirmation page.
   A form may name a custom success panel via data-success-id="<element id>"
   (used by membership.html to show the Square payment step); otherwise the
   generic thank-you below is used. */
(function () {
  "use strict";
  if (!window.fetch || !window.FormData) return; /* very old browser → normal POST */

  var SUCCESS_HTML =
    '<div class="form-success" role="status" style="text-align:center;padding:48px 24px;">' +
      '<div class="eyebrow center">Message Received</div>' +
      '<h3 style="font-family:\'Playfair Display\',serif;font-size:1.8rem;margin:10px 0 0;">' +
        'Thank you &mdash; <em style="color:var(--gold);">we&rsquo;ve got it.</em></h3>' +
      '<p style="margin:18px auto 0;font-size:.92rem;line-height:1.8;color:var(--mid);max-width:440px;">' +
        'Your note is on its way to our team. We&rsquo;ll be in touch soon &mdash; usually within a business day.</p>' +
    '</div>';

  Array.prototype.forEach.call(
    document.querySelectorAll('form[action*="formspree.io"]'),
    function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var btn = form.querySelector('button[type="submit"], button:not([type])');
        var btnLabel = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }

        var oldError = form.querySelector(".form-error");
        if (oldError) oldError.parentNode.removeChild(oldError);

        /* form.action is read at submit time on purpose — contact.html
           swaps it to the Oxford endpoint when that location is chosen. */
        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        }).then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          var tplId = form.getAttribute("data-success-id");
          var tpl = tplId ? document.getElementById(tplId) : null;
          form.innerHTML = tpl ? tpl.innerHTML : SUCCESS_HTML;
          if (form.scrollIntoView) form.scrollIntoView({ behavior: "smooth", block: "center" });
        }).catch(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; }
          var p = document.createElement("p");
          p.className = "form-error";
          p.setAttribute("role", "alert");
          p.style.cssText = "font-size:.85rem;line-height:1.7;color:#a33;margin:0;";
          p.innerHTML = 'Something went wrong sending your message. Please try again, or email us directly at ' +
            '<a href="mailto:info@miajunefacialbar.com" style="color:var(--gold);">info@miajunefacialbar.com</a>.';
          form.appendChild(p);
        });
      });
    }
  );
})();
