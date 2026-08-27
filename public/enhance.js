const GOOGLE_FORM_ENDPOINT='https://docs.google.com/forms/d/e/1FAIpQLSfRmwQMNjvPCn89fFujWLcg4qNWo_qx7IQFXVfBBq0z41YSOw/formResponse';
const FIELDS={name:'entry.2093849879',email:'entry.1447777989',contact:'entry.1498876745',role:'entry.1742279738',coupon:'entry.256720589'};
const IMAGES={banner:'/img/nter-banner.b64',lead:'/img/do-parliamentarians-really-care.b64',bills:'/img/seven-bills-on-the-floor.b64',cyber:'/img/cyber-crime-india.b64',aravalli:'/img/aravalli-hearing.b64',gems:'/img/gems-of-india.b64'};

async function dataUri(path){
  const r=await fetch(path,{cache:'force-cache'});
  if(!r.ok) throw new Error(`Image asset failed: ${path}`);
  return 'data:image/webp;base64,'+(await r.text()).trim();
}
function makeCode(email){
  let h=0; for(let i=0;i<email.length;i++) h=(h*31+email.charCodeAt(i))>>>0;
  return 'NTER-30-'+h.toString(36).toUpperCase().padStart(6,'0').slice(-6);
}
function storyPhoto(section,src,alt,caption){
  if(!section||section.querySelector('.editorial-photo')) return;
  const utility=section.querySelector('.utility-row'); if(!utility) return;
  const fig=document.createElement('figure'); fig.className='editorial-photo';
  fig.innerHTML=`<img alt="${alt}" loading="lazy" decoding="async"><figcaption>${caption}</figcaption>`;
  fig.querySelector('img').src=src; utility.insertAdjacentElement('afterend',fig);
}
function buildSections(){
  const front=document.querySelector('.frontpage'); if(!front||front.querySelector('.daily-edition-shell')) return;
  const why=front.querySelector('.why-panel');
  const daily=document.createElement('section'); daily.className='daily-edition-shell';
  daily.innerHTML='<header class="editorial-section-head"><div><span class="section-no">01</span><span class="section-kicker">Daily edition</span><h2>Articles</h2></div><p>Reporting, data and analysis for today. This section changes with every Chronicle edition.</p></header>';
  front.insertBefore(daily,front.firstChild);
  [...front.children].forEach(child=>{if(child!==daily&&child!==why&&child.compareDocumentPosition(why)&Node.DOCUMENT_POSITION_FOLLOWING)daily.appendChild(child)});
  if(why){
    const product=document.createElement('section'); product.className='product-note-shell';
    product.innerHTML='<header class="editorial-section-head compact"><div><span class="section-no">02</span><span class="section-kicker">Product note</span><h2>Behind Chronicle</h2></div><p>The terminal, methodology and early-access path behind the publication.</p></header>';
    front.insertBefore(product,why); product.appendChild(why);
  }
}
function cleanFooters(){
  document.querySelectorAll('.sign-off').forEach(el=>el.innerHTML='<span class="so-brand">nter.pro</span>');
  document.querySelectorAll('.n-footer').forEach(el=>el.innerHTML='<span>nter.pro</span><span>Chronicle · Public Intelligence Edition</span>');
}
function wireGoogleForm(){
  const form=document.getElementById('wl-form'); if(!form) return;
  if(!document.getElementById('wl-contact')){
    const roleField=document.getElementById('wl-role')?.closest('.wl-field');
    const field=document.createElement('div'); field.className='wl-field';
    field.innerHTML='<label for="wl-contact">Contact number</label><input type="tel" id="wl-contact" name="contact" placeholder="+91 98765 43210" autocomplete="tel" required>';
    roleField?roleField.before(field):form.prepend(field);
  }
  if(form.dataset.googleRecorder) return; form.dataset.googleRecorder='1';
  form.addEventListener('submit',()=>{
    const email=(document.getElementById('wl-email')?.value||'').trim(); if(!email) return;
    const name=(document.getElementById('wl-name')?.value||'').trim();
    const contact=(document.getElementById('wl-contact')?.value||'').trim();
    const role=(document.getElementById('wl-role')?.value||'').trim();
    const coupon=makeCode(email.toLowerCase());
    const frame=document.createElement('iframe'); frame.name='google-recorder-'+Date.now(); frame.style.display='none'; document.body.appendChild(frame);
    const gf=document.createElement('form'); gf.method='POST'; gf.action=GOOGLE_FORM_ENDPOINT; gf.target=frame.name; gf.style.display='none';
    const values={[FIELDS.name]:name,[FIELDS.email]:email,[FIELDS.contact]:contact,[FIELDS.role]:role,[FIELDS.coupon]:coupon};
    Object.entries(values).forEach(([k,v])=>{const i=document.createElement('input');i.type='hidden';i.name=k;i.value=v;gf.appendChild(i)});
    document.body.appendChild(gf); gf.submit(); setTimeout(()=>{gf.remove();frame.remove()},4000);
  },true);
}

(async()=>{
  document.documentElement.classList.add('nter-enhanced');
  buildSections(); cleanFooters(); wireGoogleForm();

  const banner=await dataUri(IMAGES.banner);
  let ad=document.querySelector('.ad-inventory');
  if(!ad){
    ad=document.createElement('section'); ad.className='ad-inventory'; ad.setAttribute('aria-label','Advertisement');
    ad.innerHTML='<div class="ad-label"><span>Advertisement</span><span>Campaign inventory · NTER</span></div><div class="ad-frame"><img alt="NTER — India’s Intelligent Terminal"></div>';
    const landing=document.getElementById('landing'); (landing||document.body.firstChild).before(ad);
  }
  ad.querySelector('img').src=banner;

  const lead=await dataUri(IMAGES.lead);
  const hero=document.querySelector('.hero-card');
  if(hero&&!hero.querySelector('.hero-photo')){
    const media=document.createElement('div'); media.className='hero-photo'; media.innerHTML='<img alt="Parliamentarians outside Parliament">'; media.querySelector('img').src=lead; hero.prepend(media);
  }
  storyPhoto(document.getElementById('art-2'),lead,'Parliamentarians outside Parliament','Parliament and political accountability — the lead analysis.');
  storyPhoto(document.getElementById('brd-bills'),await dataUri(IMAGES.bills),'A legislative bill document','The legislative docket.');
  storyPhoto(document.getElementById('brd-cyber'),await dataUri(IMAGES.cyber),'Cybercrime illustration','Cybercrime and digital fraud in India.');
  storyPhoto(document.getElementById('brd-aravalli'),await dataUri(IMAGES.aravalli),'People demonstrating for the Aravalli hills','Public mobilisation around the Aravalli hearing.');
  storyPhoto(document.getElementById('brd-gems'),await dataUri(IMAGES.gems),'A local video production crew','Grassroots creators producing a local story.');
})().catch(err=>console.error('Chronicle enhancement failed',err));
