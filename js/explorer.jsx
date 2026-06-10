// 3DEO — color/type explorer (uses tweaks-panel.jsx)
// Persists to localStorage keys read by js/site.js -> applyPrefs(), so the
// chosen direction follows across every page.
const { useState } = React;

const read = (k, d) => { try { return localStorage.getItem(k) || d; } catch(e){ return d; } };

function Explorer(){
  const [dir, setDir]     = useState(read('3deo-theme','electric'));
  const [accent, setAcc]  = useState(read('3deo-accent',''));
  const [fontset, setFs]  = useState(read('3deo-fontset','archivo'));

  function apply(k,v,setter){
    try{ if(v) localStorage.setItem(k,v); else localStorage.removeItem(k); }catch(e){}
    setter(v);
    window.applyPrefs && window.applyPrefs();
  }

  return (
    <TweaksPanel>
      <TweakSection label="Color direction" />
      <TweakRadio label="Direction" value={dir}
        options={['heritage','electric','field']}
        onChange={(v)=>{ apply('3deo-theme', v, setDir); }} />
      <p style={{font:'400 12px/1.5 var(--font-body)',color:'var(--muted)',margin:'2px 2px 6px'}}>
        Heritage = light + navy · Electric = light + cyan · Field = dark aerospace
      </p>

      <TweakSection label="Accent" />
      <TweakColor label="Accent" value={accent || '#1f4780'}
        options={['#1f4780','#0091c7','#119d8b','#1f97d4','#e8643f']}
        onChange={(v)=>{ apply('3deo-accent', v, setAcc); }} />

      <TweakSection label="Typography" />
      <TweakSelect label="Type system" value={fontset}
        options={['archivo','saira','sora']}
        onChange={(v)=>{ apply('3deo-fontset', v, setFs); }} />
      <p style={{font:'400 12px/1.5 var(--font-body)',color:'var(--muted)',margin:'2px 2px 0'}}>
        archivo = sturdy grotesk · saira = technical condensed · sora = geometric
      </p>

      <TweakSection label="" />
      <TweakButton label="Reset to default" onClick={()=>{
        ['3deo-theme','3deo-accent','3deo-fontset'].forEach(k=>{try{localStorage.removeItem(k);}catch(e){}});
        setDir('electric'); setAcc(''); setFs('archivo'); window.applyPrefs && window.applyPrefs();
      }} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('explorer-root')).render(<Explorer/>);
