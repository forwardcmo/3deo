/* ============================================================
   3DEO Lidar — shared site chrome
   Injects header + footer + NDA modal, handles nav, theme,
   scroll reveals. Pages set <body data-base="../"> when nested.
   ============================================================ */
(function(){
  const B = (document.body && document.body.dataset.base) || '';
  const u = (p)=> B + p;

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
      {t:'Geiger-mode Lidar', s:'What it really is — and isn’t', h:'technology/geiger-mode.html'},
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
      {t:'Defense', h:'industries/defense.html'},
      {t:'Intelligence', h:'industries/intelligence.html'},
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
      </div>
      <div class="footer-col"><h4>Technology</h4>
        <a href="${u('technology/geiger-mode.html')}">Geiger-mode Lidar</a>
        <a href="${u('technology/agile-scanning.html')}">Agile Scanning</a>
        <a href="${u('products/acadia.html')}">Acadia Software</a>
      </div>
      <div class="footer-col"><h4>Products</h4>
        <a href="${u('products/zion.html')}">Zion</a>
        <a href="${u('products/wrangell.html')}">Wrangell</a>
        <a href="${u('products/sequoia.html')}">Sequoia</a>
        <a href="${u('products/systems.html')}">All Systems</a>
      </div>
      <div class="footer-col"><h4>Explore</h4>
        <a href="${u('industries/index.html')}">Industries</a>
        <a href="${u('point-clouds/index.html')}">Point Clouds</a>
        <a href="${u('resources/index.html')}">Resources</a>
      </div>
      <div class="footer-col"><h4>Company</h4>
        <a href="${u('about/index.html')}">About</a>
        <a href="${u('about/contact.html')}">Contact</a>
        <a href="${u('about/careers.html')}">Careers</a>
        <a href="https://imagery.3deolidar.com" target="_blank" rel="noopener">Point-Cloud Viewer ↗</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} 3DEO, Inc. All rights reserved.</span>
      <span>@3deolidar &nbsp;·&nbsp; MIT Lincoln Laboratory spin-out &nbsp;·&nbsp; Norwood, MA</span>
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
