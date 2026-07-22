/* =========================================================================
   HubSpot native forms — 3DEO
   Posts the site's existing, styled forms to HubSpot via the Forms
   Submission API. No HubSpot markup or CSS is injected: design is untouched.

   ┌───────────────────────────────────────────────────────────────────────┐
   │  ▼▼▼  PASTE YOUR HUBSPOT IDs HERE — THIS IS THE ONLY SPOT TO EDIT  ▼▼▼  │
   └───────────────────────────────────────────────────────────────────────┘ */
   window.HUBSPOT = {
     portalId: "244889917",              // e.g. "44123456" (Settings ▸ Account Info)
     forms: {
       contact:          "b669b8a3-f5e6-4925-9ec5-14b7d00ad65d",   // Book a Call — about/contact.html
       project:          "ba9c7948-8b1a-4296-a222-2fe84ca0cc05",   // Tell us about your project — industries/tell-us-about-your-project.html
       industry_request: "856e0c20-d03c-478f-a2d8-86230fadfa91",  // Request an Industry — industries/request.html
       data_request:     "d06ebda6-480b-4bd5-8b2a-8ff91eda3904",      // Request a Data Set — point-clouds/request.html
       careers:          "66f69176-fbf4-4c44-af3f-1a16d62aea63",   // Join Our Team — about/careers.html
       pilot:            "d9eb09e2-5a99-4d93-93db-b055d1203237",      // Apply for a Pilot — about/pilot.html
       nda:              "b981d505-5cd3-4485-8bcb-2e4a1e5dc485"         // NDA data-access gate (modal in js/site.js)
     },
     region: "na1"                             // "na1" (US, default) | "eu1" (EU data centre)
   };
/* ┌───────────────────────────────────────────────────────────────────────┐
   │  ▲▲▲  NOTHING BELOW NEEDS EDITING  ▲▲▲                                  │
   └───────────────────────────────────────────────────────────────────────┘ */
(function(){
  var CFG = window.HUBSPOT || {};
  function configured(guid){
    return CFG.portalId && CFG.portalId.indexOf("PASTE_") !== 0 &&
           guid && guid.indexOf("PASTE_") !== 0;
  }
  function cookie(name){
    var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  }
  // Core POST. Returns a Promise. fields = [{name,value}, …]
  function post(guid, fields){
    var region = (CFG.region && CFG.region !== "na1") ? CFG.region + "." : "";
    var url = "https://api.hsforms.com/submissions/v3/integration/submit/" +
              CFG.portalId + "/" + guid;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: fields,
        context: { hutk: cookie("hubspotutk") || undefined, pageUri: location.href, pageName: document.title }
      })
    }).then(function(r){ if(!r.ok) throw new Error("HubSpot " + r.status); return r; });
  }
  // Programmatic submit by form key — used by the NDA gate in site.js.
  // Returns a Promise; rejects (or resolves false) if not configured.
  window.HubSpotForms = {
    isConfigured: function(key){ return configured(CFG.forms && CFG.forms[key]); },
    submit: function(key, fields){
      var guid = CFG.forms && CFG.forms[key];
      if(!configured(guid)) return Promise.resolve(false);
      return post(guid, fields).then(function(){ return true; });
    }
  };
  // Collect named inputs → HubSpot fields[]. "fullname" splits into first/last.
  function collect(form){
    var fields = [];
    form.querySelectorAll("input[name], select[name], textarea[name]").forEach(function(el){
      if(el.type === "file") return;                 // files are not sent via this API
      var v = (el.value || "").trim();
      if(!v) return;
      if(el.name === "fullname"){
        var parts = v.split(/\s+/);
        fields.push({ name: "firstname", value: parts.shift() });
        if(parts.length) fields.push({ name: "lastname", value: parts.join(" ") });
      } else {
        fields.push({ name: el.name, value: v });
      }
    });
    return fields;
  }
  function showSuccess(form){
    var ok = form.querySelector(".form-success, .form-ok, [data-hs-success]");
    if(ok){ ok.classList.add("show"); ok.style.display = "block"; }
    form.querySelectorAll("input, textarea").forEach(function(x){
      if(x.type !== "select-one") x.value = "";
    });
  }
  function mailtoFallback(form){
    var lines = [];
    form.querySelectorAll("input[name], select[name], textarea[name]").forEach(function(el){
      if(el.type === "file") return;
      var wrap = el.closest(".form-field, div");
      var label = wrap && wrap.querySelector("label");
      lines.push((label ? label.textContent.trim() : el.name) + ": " + (el.value || "").trim());
    });
    window.location.href = "mailto:sales@3deolidar.com?subject=" +
      encodeURIComponent("Website inquiry — 3DEO") + "&body=" + encodeURIComponent(lines.join("\n"));
  }
  function attach(form){
    var key = form.getAttribute("data-hs-form");
    var guid = CFG.forms && CFG.forms[key];
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      if(!configured(guid)){ mailtoFallback(form); showSuccess(form); return; }
      if(btn){ btn.disabled = true; btn.dataset._t = btn.textContent; btn.textContent = "Sending…"; }
      post(guid, collect(form)).then(function(){
        showSuccess(form);
      }).catch(function(err){
        console.warn("[HubSpot] submit failed, falling back to email:", err);
        mailtoFallback(form); showSuccess(form);
      }).finally(function(){
        if(btn){ btn.disabled = false; btn.textContent = btn.dataset._t || "Send"; }
      });
    });
  }
  function init(){ document.querySelectorAll("form[data-hs-form]").forEach(attach); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
