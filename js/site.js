/* ============================================================
   3DEO Lidar — shared site chrome
   Injects header + footer + NDA modal, handles nav, theme,
   scroll reveals. Pages set <body data-base="../"> when nested.
   ============================================================ */
(function(){
  const B = (document.body && document.body.dataset.base) || '';
  const u = (p)=> B + p;

  /* ---- FontAwesome Pro kit ---- */
  if(!document.getElementById('fa-kit')){
    const faKit=document.createElement('script');
    faKit.id='fa-kit';faKit.src='https://kit.fontawesome.com/d4030a9fac.js';faKit.crossOrigin='anonymous';
    document.head.appendChild(faKit);
  }

  /* ---- design prefs persistence (set by Tweaks / explorer) ---- */
  const FONTSETS = {
    archivo:{disp:"'Archivo', sans-serif", body:"'Hanken Grotesk', sans-serif"},
    saira:{disp:"'Saira', sans-serif", body:"'Saira', sans-serif"},
    sora:{disp:"'Sora', sans-serif", body:"'Hanken Grotesk', sans-serif"}
  };
  window.SITE_FONTSETS = FONTSETS;
  window.applyPrefs = function(){
    const el = document.documentElement;
    try{
      const t = localStorage.getItem('3deo-theme');
      if(t) el.setAttribute('data-theme', t);
      else el.removeAttribute('data-theme');
      const a = localStorage.getItem('3deo-accent');
      if(a){ el.style.setProperty('--accent', a); el.style.setProperty('--accent-hover', a); }
      else { el.style.removeProperty('--accent'); el.style.removeProperty('--accent-hover'); }
      const f = localStorage.getItem('3deo-fontset');
      if(f && FONTSETS[f]){ el.style.setProperty('--font-display', FONTSETS[f].disp); el.style.setProperty('--font-body', FONTSETS[f].body); }
      else { el.style.removeProperty('--font-display'); el.style.removeProperty('--font-body'); }
    }catch(e){}
  };
  window.applyPrefs();

  /* ---- nav model (mirrors the sitemap) ---- */
  const NAV = [
    {label:'Technology', href:'technology/index.html', items:[
      {t:'Geiger-mode Lidar', s:'Heightened photon sensitivity, high data recording rates and agile geo-referenced scanning — map faster, at higher resolution in more detail, all from a single configurable lidar system.', h:'technology/geiger-mode.html'},
      {t:'Agile Geo-Referenced Scanning', s:'Multi-angle capture, fewer shadows', h:'technology/agile-scanning.html'},
    ]},
    {label:'Products', href:'products/index.html', items:[
      {t:'Lidar Systems', s:'Zion · Wrangell · Sequoia', h:'products/systems.html'},
      {t:'Zion', s:'3,000–12,000 ft', h:'products/zion.html'},
      {t:'Wrangell', s:'5,000–16,000 ft', h:'products/wrangell.html'},
      {t:'Sequoia', s:'20,000–50,000 ft', h:'products/sequoia.html'},
      {t:'Acadia Software Suite', s:'Raw returns → finished point clouds', h:'products/acadia.html'},
    ]},
    {label:'Industries', href:'industries/index.html', wide:true, items:[
      {t:'Forestry', h:'industries/forestry.html'},
      {t:'City Mapping', h:'industries/city-mapping.html'},
      {t:'Utilities', h:'industries/utilities.html'},
      {t:'Intelligence, Surveillance & Reconnaissance', h:'industries/intelligence.html'},
      {t:'Disaster Relief', h:'industries/disaster-relief.html'},
      {t:'Oil & Gas', h:'industries/oil-and-gas.html'},
      {t:'Archeology', h:'industries/archeology.html'},
      {t:'Request an industry →', h:'industries/request.html'},
    ]},
    {label:'Point Clouds', href:'point-clouds/index.html', items:[
      {t:'City Maps', h:'point-clouds/city-maps.html'},
      {t:'Forestry', h:'point-clouds/forestry.html'},
      {t:'Transmission Lines', h:'point-clouds/transmission-lines.html'},
      {t:'Archeology', h:'point-clouds/archeology.html'},
      {t:'Request a data set →', h:'point-clouds/request.html'},
    ]},
    {label:'Resources', href:'resources/index.html', items:[
      {t:'White Papers', s:'Peer-grade technical depth', h:'resources/whitepapers.html'},
      {t:'Case Studies', s:'Real collections, real results', h:'resources/case-studies.html'},
      {t:'Presentations', s:'Talks & briefings', h:'resources/presentations.html'},
    ]},
    {label:'About', href:'about/index.html', items:[
      {t:'Company', s:'MIT Lincoln Lab spin-out', h:'about/index.html'},
      {t:'News & Events', s:'Publications & upcoming shows', h:'about/news.html'},
      {t:'Contact Us', h:'about/contact.html'},
      {t:'Join Our Team', h:'about/careers.html'},
      {t:'Compliance', h:'about/compliance.html'},
    ]},
  ];

  /* ---- header ---- */
  const brand = `<a class="brand" href="${u('index.html')}" aria-label="3DEO Lidar home">
      <img src="${u('assets/logo-3deo.webp')}" alt="3DEO">
      <span class="brand-txt"><span class="brand-name">3DEO</span><span class="brand-sub">Geiger-mode Lidar</span></span>
    </a>`;

  const navLinks = NAV.map(n=>{
    const dd = n.items ? `<div class="dropdown${n.wide?' dd-wide':''}">
        ${n.wide?`<div class="dd-head">Industries we serve</div>`:''}
        ${n.items.map(i=>`<a class="dd-link" href="${u(i.h)}">${i.t}${i.s?`<span class="dd-sub">${i.s}</span>`:''}</a>`).join('')}
      </div>`:'';
    return `<div class="nav-item">
        <a class="nav-link" href="${u(n.href)}">${n.label}${n.items?'<span class="caret"></span>':''}</a>
        ${dd}
      </div>`;
  }).join('');

  const header = document.createElement('header');
  header.className='site-header';
  header.innerHTML = `<div class="wrap-wide"><nav class="nav">
      ${brand}
      <div class="nav-links">${navLinks}</div>
      <div class="nav-cta">
        <a class="btn btn-primary" href="${u('about/contact.html')}">Book a Call</a>
        <button class="nav-toggle" aria-label="Open menu"><span></span></button>
      </div>
    </nav></div>`;
  document.body.prepend(header);

  /* ---- mobile menu ---- */
  const mm = document.createElement('div');
  mm.className='mobile-menu';
  mm.innerHTML = `<div class="mm-top">${brand}<button class="mm-close" aria-label="Close menu">×</button></div>
    ${NAV.map(n=>`<div class="mm-group">
        <a href="${u(n.href)}" class="mm-label">${n.label}</a>
        ${n.items?`<div class="mm-sub">${n.items.map(i=>`<a href="${u(i.h)}">${i.t}</a>`).join('')}</div>`:''}
      </div>`).join('')}
    <div class="mm-group"><a class="btn btn-primary btn-lg" style="margin-top:.4rem" href="${u('about/contact.html')}">Book a Call</a></div>`;
  document.body.appendChild(mm);
  header.querySelector('.nav-toggle').addEventListener('click',()=>mm.classList.add('open'));
  mm.querySelector('.mm-close').addEventListener('click',()=>mm.classList.remove('open'));
  mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mm.classList.remove('open')));

  /* ---- footer ---- */
  const colTech = NAV.find(n=>n.label==='Technology');
  const footer = document.createElement('footer');
  footer.className='site-footer';
  footer.innerHTML = `<div class="wrap-wide">
    <div class="footer-grid">
      <div class="footer-brand">
        ${brand}
        <p class="footer-contact">
          Airborne Geiger-mode lidar for rapid, large-scale 3D mapping.<br>
          106 Access Road, Suite 106<br>Norwood, MA 02062 USA<br>
          <a href="mailto:sales@3deolidar.com">sales@3deolidar.com</a>
        </p>
        <div class="footer-social">
          <a href="https://www.linkedin.com/company/3deo-inc/" target="_blank" rel="noopener" aria-label="3DEO on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg></a>
          <a href="https://x.com/3deolidar" target="_blank" rel="noopener" aria-label="3DEO on X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.82l4.72 6.23 5.45-6.23zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z"/></svg></a>
          <a href="https://bsky.app/profile/3deolidar.bsky.social" target="_blank" rel="noopener" aria-label="3DEO on Bluesky"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8C10.9 8.6 7.9 4.9 5.1 3 2.4 1.1 1.4 1.4.7 1.7 0 2 0 3.1 0 3.8c0 .7.4 5.6.6 6.4.8 2.8 3.7 3.7 6.4 3.4-4 .6-7.5 2-2.9 7.2 5 5.4 6.9-1.2 7.9-4.5 1 3.3 2.9 9.9 7.9 4.5 4.6-5.2 1.1-6.6-2.9-7.2 2.7.3 5.6-.6 6.4-3.4.2-.8.6-5.7.6-6.4 0-.7 0-1.8-.7-2.1-.7-.3-1.7-.6-4.4 1.3C16 4.9 13.1 8.6 12 10.8z"/></svg></a>
        </div>
      </div>
      <div class="footer-col"><h4>Technology</h4>
        <a href="${u('technology/geiger-mode.html')}">Geiger-mode Lidar</a>
        <a href="${u('technology/agile-scanning.html')}">Agile Scanning</a>
      </div>
      <div class="footer-col"><h4>Products</h4>
        <a href="${u('products/acadia.html')}">Acadia Software</a>
        <a href="${u('products/zion.html')}">Zion</a>
        <a href="${u('products/wrangell.html')}">Wrangell</a>
        <a href="${u('products/sequoia.html')}">Sequoia</a>
        <a href="${u('products/systems.html')}">All Systems</a>
      </div>
      <div class="footer-col"><h4>Explore</h4>
        <a href="${u('industries/index.html')}">Industries</a>
        <a href="${u('point-clouds/index.html')}">Point Clouds</a>
        <a href="${u('resources/index.html')}">Resources</a>
        <a href="https://imagery.3deolidar.com" target="_blank" rel="noopener">Point-Cloud Viewer ↗</a>
      </div>
      <div class="footer-col"><h4>Company</h4>
        <a href="${u('about/index.html')}">About</a>
        <a href="${u('about/news.html')}">News &amp; Events</a>
        <a href="${u('about/contact.html')}">Contact</a>
        <a href="${u('about/careers.html')}">Careers</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} 3DEO, Inc. All rights reserved.</span>
      <span>@3deolidar &nbsp;·&nbsp; Military precision, commercialized &nbsp;·&nbsp; Norwood, MA</span>
    </div>
  </div>`;
  document.body.appendChild(footer);

  /* ---- NDA gate ---- */
  const NDA_KEY='3deo-nda-v1';
  const NDA_TEXT = `This Mutual Confidentiality Agreement governs access to 3DEO point-cloud data and related materials. By entering your name and email and checking the box below, you (the "Recipient") agree to treat all data, derived products, and discussions as Confidential Information; to use it solely for internal evaluation; and not to disclose, publish, redistribute, or use it for any third party's benefit without 3DEO's prior written consent. Confidential Information excludes information that is or becomes public through no breach by Recipient, was lawfully known prior to disclosure, is independently developed without use of the data, or is rightfully obtained from an authorized third party. This agreement reflects the terms of 3DEO, Inc.'s standard Mutual Confidentiality Agreement; a full executed copy is available on request from sales@3deolidar.com.`;

  function hasAgreed(){ try{ return !!JSON.parse(localStorage.getItem(NDA_KEY)||'null'); }catch(e){ return false; } }
  window.NDA = { hasAgreed, text:NDA_TEXT };

  const scrim = document.createElement('div');
  scrim.className='modal-scrim';
  scrim.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="nda-title">
    <div class="modal-head">
      <div class="eyebrow" style="margin-bottom:.6rem">Confidential Data Access</div>
      <h3 id="nda-title">Agree to view point-cloud data</h3>
    </div>
    <div class="modal-body">
      <p style="font-size:.95rem">Our point clouds are shared under a mutual confidentiality agreement. Enter your details and agree to the terms to unlock the full-resolution viewer.</p>
      <div class="nda-text">${NDA_TEXT}</div>
      <div class="field"><label for="nda-name">Full name</label><input id="nda-name" type="text" autocomplete="name" placeholder="Jane Surveyor"></div>
      <div class="field"><label for="nda-email">Work email</label><input id="nda-email" type="email" autocomplete="email" placeholder="jane@firm.com"></div>
      <label class="check" style="margin:.4rem 0 1.2rem"><input id="nda-agree" type="checkbox"><span>I have read and agree to the confidentiality terms above, and I am authorized to enter into this agreement.</span></label>
      <div class="wrap-btns">
        <button class="btn btn-primary btn-lg" id="nda-submit">Agree &amp; view data <span class="arrow">→</span></button>
        <button class="btn btn-outline btn-lg" id="nda-cancel">Cancel</button>
      </div>
      <p id="nda-err" style="color:var(--s5);font-size:.85rem;margin:.8rem 0 0;display:none">Please complete all fields and accept the terms.</p>
    </div>
  </div>`;
  document.body.appendChild(scrim);

  let pendingHref=null;
  function openNDA(href){ pendingHref=href||null; scrim.classList.add('open'); }
  function closeNDA(){ scrim.classList.remove('open'); }
  scrim.querySelector('#nda-cancel').addEventListener('click',closeNDA);
  scrim.addEventListener('click',e=>{ if(e.target===scrim) closeNDA(); });
  scrim.querySelector('#nda-submit').addEventListener('click',()=>{
    const name=scrim.querySelector('#nda-name').value.trim();
    const email=scrim.querySelector('#nda-email').value.trim();
    const ok=scrim.querySelector('#nda-agree').checked;
    const valid = name.length>1 && /.+@.+\..+/.test(email) && ok;
    if(!valid){ scrim.querySelector('#nda-err').style.display='block'; return; }
    try{ localStorage.setItem(NDA_KEY, JSON.stringify({name,email,at:new Date().toISOString()})); }catch(e){}
    // Register the viewer as a HubSpot contact (fires only once IDs are configured)
    if(window.HubSpotForms && window.HubSpotForms.isConfigured('nda')){
      var parts=name.split(/\s+/);
      var f=[{name:'email',value:email},{name:'firstname',value:parts.shift()}];
      if(parts.length) f.push({name:'lastname',value:parts.join(' ')});
      f.push({name:'viewed_point_cloud_data',value:'true'});
      f.push({name:'point_cloud_viewed_at',value:new Date().toISOString().slice(0,10)});
      window.HubSpotForms.submit('nda', f).catch(function(err){ console.warn('[HubSpot] NDA submit failed:', err); });
    }
    closeNDA();
    document.documentElement.setAttribute('data-unlocked','true');
    document.querySelectorAll('[data-nda-gated]').forEach(el=>el.setAttribute('data-unlocked','true'));
    if(pendingHref){ window.open(pendingHref,'_blank','noopener'); }
  });

  // any element with [data-nda] triggers the gate; data-nda value = href to open after agree
  document.addEventListener('click',e=>{
    const trig=e.target.closest('[data-nda]');
    if(!trig) return;
    e.preventDefault();
    const href=trig.getAttribute('data-nda')||trig.getAttribute('href')||'https://imagery.3deolidar.com';
    if(hasAgreed()){ window.open(href,'_blank','noopener'); }
    else openNDA(href);
  });
  if(hasAgreed()){ document.documentElement.setAttribute('data-unlocked','true'); document.querySelectorAll('[data-nda-gated]').forEach(el=>el.setAttribute('data-unlocked','true')); }

  /* ---- scroll reveal (rect-based; IntersectionObserver is unreliable here) ---- */
  function reveal(){
    const h = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(el=>{
      const r = el.getBoundingClientRect();
      if(r.top < h*0.92 && r.bottom > 0) el.classList.add('in');
    });
  }
  function revealAll(){ document.querySelectorAll('[data-reveal]:not(.in)').forEach(el=>el.classList.add('in')); }
  window.bindReveal = reveal;
  window.addEventListener('scroll', reveal, {passive:true});
  window.addEventListener('resize', reveal, {passive:true});
  requestAnimationFrame(reveal);
  setTimeout(reveal, 120);
  setTimeout(reveal, 400);
  // failsafe: never leave content hidden
  setTimeout(revealAll, 2500);
})();
