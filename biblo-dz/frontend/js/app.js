

//  configgg

let API_BASE = null;

function uniq(arr) {

  return [...new Set(arr.filter(Boolean))];

}

async function initApiBase() {

  if (API_BASE)
    
    return API_BASE;

  const saved = (() =>
    
    {

    try 
    { 
      return
       localStorage.getItem('biblio_api_base'); }
    catch { 
      return null; 


    }
  })();

  const candidates = uniq([

    saved,
    window.location.origin.startsWith('http') 

    ? `${window.location.origin}/api` : null,

    'http://localhost:5001/api',

    'http://localhost:5000/api',
  ]);

  for (const base of candidates) 
    {

    try 
    {
      const res = await fetch(base + '/health', { cache: 'no-store' });
      if (res.ok) 
        {

        API_BASE = base;

        try {
           localStorage.setItem('biblio_api_base', base); 
          } catch
           { 
            /* ignoreeee */ 

           }

        return API_BASE;
      }
    } catch 
    
    
    { 

      /* try next */ 
    }
  }

  API_BASE = window.location.origin.startsWith('http')
    ? `${window.location.origin}/api`

                 : 'http://localhost:5001/api';

  return API_BASE;
}

//  STATE 
let specSlug    = '';
let moduleId    = null;
let moduleName  = '';
let docFilter   = { type:'', sort:'recent' };
let searchPage  = 1;
let lastSearchKey = '';
let allSpecs    = [];
let allMods     = [];


//  TYPE LABELS 
const TYPE = {
  cours:'محاضرة', td:'TD', tp:'TP',

  examen:'امتحان', correction:'تصحيح',

  these:'أطروحة', resume:'ملخص', rapport:'تقرير'

};

//  SPECIALITES DATA 

const SPECS = [
  {id:1,  nom:'Médecine',              slug:'medecine',            icone:'fas fa-heartbeat',       couleur:'#e74c3c', nb_modules:30, description:'1ère à 6ème année, toutes les spécialités'},
  {id:2,  nom:'Science et Technologie',slug:'science-technologie', icone:'fas fa-atom',            couleur:'#3498db', nb_modules:20, description:'Physique, Chimie, Maths, Analyse...'},
  {id:3,  nom:'Biologie',             
    
    slug:'biologie',            icone:'fas fa-dna',             couleur:'#27ae60', nb_modules:15, description:'SNV, Biochimie, Microbiologie, Génétique...'},
  {id:4,  nom:'Pharmacie',            
    
    slug:'pharmacie',           icone:'fas fa-pills',           couleur:'#9b59b6', nb_modules:12, description:'Pharmacologie, Galénique, Infectiologie...'},
  {id:5,  nom:'Informatique',         
    
    slug:'informatique',        icone:'fas fa-laptop-code',     couleur:'#2980b9', nb_modules:52, description:'IA, Réseaux, GL, Bases de données, Programmation...'},
  {id:6,  nom:'Sciences de la Matière'
    
    ,slug:'sciences-matiere',   icone:'fas fa-flask',           couleur:'#f39c12', nb_modules:14, description:'Physique, Acoustique, Thermodynamique...'},
  {id:7,  nom:'Chimie',               
    
    slug:'chimie',              icone:'fas fa-vial',            couleur:'#1abc9c', nb_modules:16, description:'Fondamentale, Analytique, Polymères...'},
  {id:8,  nom:'Physique',             
    
    slug:'physique',            icone:'fas fa-satellite',       couleur:'#e67e22', nb_modules:14, description:'Théorique, Nucléaire, Nano...'},
  {id:9,  nom:'Génie des Procédés',   
    
    slug:'genie-procedes',      icone:'fas fa-industry',        couleur:'#95a5a6', nb_modules:10, description:'Pétrochimie, Alimentaire...'},
  {id:10, nom:'Génie Civil',          
    
    slug:'genie-civil',         icone:'fas fa-hard-hat',        couleur:'#7f8c8d', nb_modules:14, description:'Structures, Travaux Publics, Géotechnique...'},
  {id:11, nom:'Génie Mécanique',      
    
    slug:'genie-mecanique',     icone:'fas fa-cogs',            couleur:'#34495e', nb_modules:12, description:'Aéronautique, Fabrication, Matériaux...'},
  {id:12, nom:'Hydraulique',          
    
    slug:'hydraulique',         icone:'fas fa-water',           couleur:'#2471a3', nb_modules:8,  description:'Gestion des eaux, Assainissement...'},
  {id:13, nom:'Electronique',         
    
    slug:'electronique',        icone:'fas fa-microchip',       couleur:'#8e44ad', nb_modules:12, description:'Microélectronique, Systèmes embarqués...'},
  {id:14, nom:'Automatique',          
    
    slug:'automatique',         icone:'fas fa-robot',           couleur:'#16a085', nb_modules:10, description:'Robotique, Systèmes automatisés...'},
  {id:15, nom:'Télécommunication',    
    
    slug:'telecommunication',   icone:'fas fa-broadcast-tower', couleur:'#2e86c1', nb_modules:12, description:'Signaux, Réseaux, Radio, Internet...'},
  {id:16, nom:'Electrotechnique',     
    
    slug:'electrotechnique',    icone:'fas fa-bolt',            couleur:'#d68910', nb_modules:10, description:'Machines Électriques, Réseaux...'},
  {id:17, nom:'Sciences Économiques', 
    
    slug:'sciences-economiques',icone:'fas fa-chart-line',      couleur:'#148f77', nb_modules:14, description:'Macro, Micro économie, Econométrie...'},
  {id:18, nom:'Sciences De Gestion',  
    
    slug:'sciences-gestion',    icone:'fas fa-briefcase',       couleur:'#943126', nb_modules:12, description:'Finance, Marketing, GRH, Management...'},
];

const DEMO_MODS = [

  {
    id:1, nom:'Algorithmique 1',                  
    
    
    niveau:'L1', nb_documents:20},
  {
    id:2, nom:'Algorithmique 2',                  
    
    
    niveau:'L2', nb_documents:15},
  {
    id:3, nom:'Analyse 1',                        
    
    
    niveau:'L1', nb_documents:22},
  {id:4, nom:'Algèbre 1',                        
    
    
    niveau:'L1', nb_documents:19},
  {
    id:5, nom:'Programmation C',                  
    
    
    niveau:'L1', nb_documents:30},
  {id:6, nom:'Logique Mathématique',             
    
    
    niveau:'L1', nb_documents:12},
  {id:7, nom:'Algorithmique et Structures',      
    
    
    niveau:'L2', nb_documents:18},
  {id:8, nom:'Programmation C++',                
    
    
    niveau:'L2', nb_documents:24},
  {id:9, nom:'Programmation Java',               
    
    
    niveau:'L2', nb_documents:26},
  {id:10,nom:'Base de données 1',                
    
    
    niveau:'L2', nb_documents:22},
  {id:11,nom:'Réseaux Informatiques 1',          
    
    
    niveau:'L2', nb_documents:21},
  {id:12,nom:'Systèmes d\'Exploitation 1',       
    
    
    niveau:'L2', nb_documents:23},
  {id:13,nom:'Probabilités et Statistiques',     
    
    
    niveau:'L2', nb_documents:19},
  {id:14,nom:'Analyse numérique',                
    
    
    niveau:'L2', nb_documents:16},
  {id:15,nom:'Génie Logiciel',                   
    
    
    niveau:'L3', nb_documents:19},
  {id:16,nom:'Base de données 2',                
    
    
    niveau:'L3', nb_documents:17},
  {id:17,nom:'Développement Web',                
    
    
    niveau:'L3', nb_documents:20},
  {id:18,nom:'Réseaux Informatiques 2',          
    
    
    niveau:'L3', nb_documents:18},
  {id:19,nom:'Compilation',                      
    
    
    niveau:'L3', nb_documents:10},
  {id:20,nom:'Théorie des Graphes',              
    
    
    niveau:'L3', nb_documents:14},
  {id:21,nom:'Programmation Python',             
    
    
    niveau:'L3', nb_documents:22},
  {id:22,nom:'Génie Logiciel',                   
    
    
    niveau:'L3', nb_documents:19},
  {id:23,nom:'Apprentissage Automatique',        
    
    
    niveau:'M1', nb_documents:13},
  {id:24,nom:'Intelligence Artificielle',        
    
    
    niveau:'M1', nb_documents:16},
  {id:25,nom:'Sécurité Informatique',            
    
    
    niveau:'M1', nb_documents:11},
  {id:26,nom:'Développement Mobile',             
    
    
    niveau:'M1', nb_documents:12},
  {id:27,nom:'Cryptographie',                    
    
    
    niveau:'M1', nb_documents:9},
  {id:28,nom:'Algorithmique Avancée',            
    
    
    niveau:'M2', nb_documents:8},
  {id:29,nom:'Apprentissage Profond',            
    
    
    niveau:'M2', nb_documents:8},
  {id:30,nom:'Vision par Ordinateur',            
    
    
    niveau:'M2', nb_documents:7},
  {id:31,nom:'Sujets Doctorat',                  
    
    
    niveau:'Doctorat', nb_documents:5},
];

const MOD_ICONS = [

  'fas fa-server','fas fa-code','fas fa-brain','fas fa-globe','fas fa-database',

  'fas fa-project-diagram','fas fa-chart-bar','fas fa-terminal','fas fa-microchip',

  'fas fa-shield-alt','fas fa-network-wired','fas fa-laptop','fas fa-cog',

  'fas fa-cube','fas fa-infinity','fas fa-sitemap','fas fa-code-branch',
  'fas fa-calculator','fas fa-wave-square','fas fa-puzzle-piece',
  'fas fa-flask','fas fa-graduation-cap','fas fa-scroll','fas fa-book',
];

  //  INIT
document.addEventListener('DOMContentLoaded', async () => {

  await initApiBase();

  await loadSpecs();

  renderHomeSpecs();

  renderAllSpecs();

  loadFeaturedDocs();

  loadStats();
  populateSearchSpecs();

  populateUploadSpecs();


  setupDropzone();
  setupEsc();
  setupOutsideClick();
});


  //  API heallthee
async function api(url, opts = {}) 
{
  const base = await initApiBase();

  const res = await fetch(base + url,
     {
    ...opts,
    headers: {

      'Content-Type': 'application/json',
      ...opts.headers,

    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || '  wrong in serverr');
  return data;
}

  //  PAGES navgationn هنا نتاع التنقل

function showPage(name)

{
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + name);

  if (el) el.classList.add('active');

  window.scrollTo(
    { 
      top: 0, behavior: 'smooth' 

  }
);

  // Update active nav link
  document.querySelectorAll('.nav__link').forEach(l => 
    
    {

    l.classList.toggle('active', l.dataset.page === name);

  });

  //                                 page-specific load
  const actions = {
    home:       () =>
      
      {
         renderHomeSpecs(); loadFeaturedDocs(); },
    specialites:() =>
      
      renderAllSpecs(),
    upload:     () =>
      
      populateUploadSpecs(),
  };
  actions[name]?.();

}

  //  STATS hero numbers
async function loadStats() {

  try {

    const s = await api('/stats/global');
    setEl('hs-docs',  s.documents?.toLocaleString('ar') || '٠');

    setEl('hs-mods',  s.modules?.toLocaleString('ar') || '٠');

    setEl('hs-dl',    s.telechargements?.toLocaleString('ar') || '٠');

  } catch(e) 
  { 
    /* keep defaults */
  
  }
}

                                    //  SPECIALITES all
async function loadSpecs()

{
  try { allSpecs = await api('/specialites'); }
  catch(e) { allSpecs = SPECS; }
}

function specCard(s) {
  return `
  <div class="spec-card" onclick="goToSpec('${s.slug}')">

    <div class="spec-card__icon" style="background:${
      s.couleur
    }18;color:${s.couleur}">
      <i class="${s.icone || 'fas fa-book'}">
      </i>

    </div>
    <div>
      <p class="spec-card__name">${s.nom}</p>
      <p class="spec-card__desc">${s.description || ''}</p>
      <p class="spec-card__count"><i class="fas fa-layer-group"></i> ${s.nb_modules || 0} وحدة${s.nb_documents ? ` · ${s.nb_documents} وثيقة` : ''}</p>
    </div>
  </div>`;
}

function renderHomeSpecs() {


  setHTML('homeSpecGrid', allSpecs.slice(0, 6).map(specCard).join(''));

}

function renderAllSpecs() {

  setHTML('allSpecGrid', allSpecs.map(specCard).join('') || skeleton());

}

  //  MODULES

async function goToSpec(slug) {

  specSlug = slug;

  showPage('modules');

  const spec = allSpecs.find(s => s.slug === slug) || { nom: slug };

  setEl('modTitle', spec.nom);

  setEl('modSub', spec.description || '');

  setHTML('modBreadcrumb', breadcrumb([

    { 
      label: 'الرئيسية', action: "showPage('home')"

     },
    {
       label: 'التخصصات', action: "showPage('specialites')"
      
      },
    {
       label: spec.nom 
      
      },
  ]
)
);

  setHTML('modulesGrid', `<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>`);

  let mods = [];

  try {
     mods = await api('/specialites/' + slug + '/modules');

   }
  catch(e) 
  { 
    mods = DEMO_MODS;
  
  }
  allMods = mods;

  const levels = ['L1','L2','L3','M1','M2','Doctorat'].filter(l => mods.some(m => m.niveau === l));
  setHTML('levelTabs',

    `<button class="level-tab active" onclick="filterLevel('',this)">الكل (${mods.length})
    
    </button>` +
    levels.map(l =>
      `<button class="level-tab" onclick="filterLevel('${l}',this)">${l} (${mods.filter(m=>m.niveau===l).length})
      
      </button>`
    ).join('')

  );

  renderMods(mods);
}

function filterLevel(level, btn) {

  document.querySelectorAll('.level-tab').forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

  renderMods(level ? allMods.filter(m => m.niveau === level) 
  : allMods);

}

function renderMods(mods) {

  if (!mods.length) {

    setHTML('modulesGrid', emptyState('fas fa-folder-open', 'لا توجد وحدات في هذا المستوى'));


    return;
  }
  setHTML('modulesGrid', mods.map((m, i) => `

    <div
    
    class="module-card" onclick="goToModule(${m.id},'${esc(m.nom)}')">
      <div class="module-card__icon"><i class="${MOD_ICONS[i % MOD_ICONS.length]}"></i></div>
      <div>
        <p class="module-card__name">${m.nom}</p>
        <p class="module-card__count"><i class="fas fa-file-pdf"></i> ${m.nb_documents || 0} 
        وثيقة</p>
      </div>
    </div>`).join('')
  );
}

  //  DOCUMENTS نتاع الةحدات

async function goToModule(id, name) {
  moduleId   = id;
  moduleName = name;
  docFilter  = { type: '', sort: 'recent' };
  showPage('documents');

  const spec = allSpecs.find(s => s.slug === specSlug) || {
     nom: specSlug
    
    };
  setEl('docTitle', name);

  setEl('docSub', spec.nom + ' — وثائق الوحدة');

  setHTML('docBreadcrumb', breadcrumb([

    {
       label: 'الرئيسية',  action: "showPage('home')"

     },
    { 
      label: spec.nom,    action: `goToSpec('${specSlug}')` 
  },
    { 
      
      label: name

     },
  ]));

  // reset filter chipsss

  document.querySelectorAll('#typeFilters .chip').forEach((c,i) => c.classList.toggle('active', i===0));

  loadDocs();

}

async function loadDocs() {

  setHTML('docsGrid', `
    <div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div>
    </div>`);
  try
   {

    const p = new URLSearchParams({ module_id: moduleId, ...docFilter, limit: 24 });

    const d = await api('/documents?' + p);

    renderDocCards('docsGrid', d.documents || d || []);

  } catch(e) 
  
  {

    renderDocCards('docsGrid', demoDocsList());
  }

}

function filterType(type, btn) 
{

  document.querySelectorAll('#typeFilters .chip').forEach(c => c.classList.remove('active'));

  btn.classList.add('active');

  docFilter.type = type;

  loadDocs();

}

function sortDocs(sort)

{

  docFilter.sort = sort;
  loadDocs();
}

function renderDocCards(containerId, docs) {

  if (!docs?.length) {

    setHTML(containerId, emptyState('fas fa-file-pdf', 'لا توجد وثائق', 'شارك وثيقة لتساعد الآخرين'));

    return;
  }
  setHTML(containerId, docs.map(d =>
    
    
    
    
    
    
    {
    const stars = [1,2,3,4,5].map(i =>

      `<i class="fas fa-star ${i <= Math.round(d.note_moyenne||0) ? 'star-on' : 'star-off'}"></i>`
    ).join('');
    return `
    <div 
    class="doc-card">
      <div class="doc-card__head">
        <div class="doc-card__pdf-icon"><i class="fas fa-file-pdf"></i></div>
        <span class="doc-card__type-badge">${TYPE[d.type_document] || d.type_document || ''}</span>
        <p class="doc-card__title">${d.titre || ''}</p>

      </div>
      <div class="doc-card__body">
        <div class="doc-card__stars">${stars}<span class="doc-card__rating-count">(${d.nb_notes||0})</span></div>
        <div class="doc-card__meta">
          ${d.auteur           
            
            ? `<div class="doc-card__meta-row"><i class="fas fa-user"></i>${d.auteur}</div>` : ''}
          ${d.universite       
            
            ? `<div class="doc-card__meta-row"><i class="fas fa-university"></i>${d.universite}</div>` : ''}
          ${d.annee_academique 
            
            ? `<div class="doc-card__meta-row"><i class="fas fa-calendar"></i>${d.annee_academique}</div>` : ''}
          <div class="doc-card__meta-row"><i class="fas fa-download"></i>${(d.nb_telechargements||0).toLocaleString()} تحميل</div>
        </div>
        <div class="doc-card__actions">
          <button class="btn-dl" onclick="dlDoc(${d.id},'${esc(d.titre||'')}')"><i class="fas fa-download"></i> تحميل</button>
        </div>
      </div>
    </div>`;
  }).join(''));
}

  //  FEATURED DOCS

async function loadFeaturedDocs() {
  try 
  
  {

    const docs = await api('/stats/top-documents?limit=8');


    renderDocCards('featuredDocs', docs);

  } 
  
  catch(e) 

  {
    setHTML('featuredDocs', `

      <div class="empty" style="grid-column:1/-1">

        <i class="fas fa-plug"></i>

        <h4>الوثائق ستظهر هنا بعد ربط الخادم</h4>

        <p>شغّل الـ backend على المنفذ 5000</p>

      </div>`);
  }
}

  //  DOWNLOAD

async function dlDoc(id, title) 
{

  toast('جاري التحميل...', 'info');

  try 
  {

    const base = await initApiBase();

    const res = await fetch(`${base}/documents/${id}/download`);

    if (!res.ok) 
      
      { 
        toast(' worrnig for download ', 'error');

         return; 
        
        }

    const blob = await res.blob();

    const url  = URL.createObjectURL(blob);

    const a    = Object.assign(document.createElement('a'),
     { href: url, download: (title || 'document') + '.pdf' 


     });
    a.click();
    
    URL.revokeObjectURL(url);

    toast('تم التحميل بنجاح ', 'success');

  } 
  catch(e)
   {
     toast('     cheackin ton server for download', 'error');

   }

}

  //  SEARCH

function heroSearch() {

  const q = getVal('heroQ').trim();

  if (!q) {
     toast('أدخل كلمة بحث', 'warning');
     
     return; 
    
    
    }

  searchPage = 1;

  setInputVal('searchQ', q);
  showPage('search');

  doSearch();
}

function populateSearchSpecs()

{

  const sel = document.getElementById('searchSpec');

  if (!sel) 
    return;

  allSpecs.forEach(s => sel.appendChild(opt(s.slug, s.nom)));

}

async function doSearch() {

  const q    = getVal('searchQ').trim();

  const spec = getVal('searchSpec');
  const type = getVal('searchType');


  const lvl  = getVal('searchLevel');

  const key = [q, spec, type, lvl].join('||');

  if (key !== lastSearchKey) {

    searchPage = 1;


    lastSearchKey = key;
  }

  if (!q) 
    { 
                       setEl('searchInfo', 'أدخل كلمة بحث');

       setHTML('searchResults','');

    
    
    return;
   }

  setHTML('searchResults', `<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>`);
  setEl('searchInfo', '');

  setHTML('searchPager', '');


  try
   {

    const p = new URLSearchParams({ 

      search: q, specialite: spec, type, niveau: lvl, page: searchPage, limit: 20 
    
    });
    const d = await api('/documents?' + p);

    setEl('searchInfo', ` we found done  ${d.total || 0} وثيقة`);

    renderDocCards('searchResults', d.documents || []);

    buildPager(d.pages || 1, searchPage);

  } 
  
  catch(e) {

    setEl('searchInfo', '  تأكد من تشغيل الخادم');


    setHTML('searchResults', emptyState('fas fa-search', 'لا نتائج'));


  }
}


function buildPager(total, current) {

  if (total <= 1) 
    
    return;

  const html = Array.from({

    length: Math.min(total,10)
  
  }, (_,i) => i+1)

    .map(i => `<button class="chip ${i===current?'active':''

    }"
       onclick="gotoPage(${i})">${i}</button>`)
    .join('');

  setHTML('searchPager', html);

}
function gotoPage(p) { 


  searchPage = p; doSearch(); 

}

  //  UPLOAD


function populateUploadSpecs() {
  const sel = document.getElementById('upSpec');
  if (!sel || sel.options.length > 1) return;
  allSpecs.forEach(s => 
    sel.appendChild(opt(s.slug, s.nom)
  
  )


);
}

async function loadModsForUpload() {
  const slug = getVal('upSpec');

  const sel  = document.getElementById('upModule');


  if (!slug) {
    
    sel.innerHTML = '<option value="">اختر التخصص أولاً</option>'; 
    return; 
  }

  sel.innerHTML = '<option value=""> جاري التحميل...</option>';

  try 
  {

    const mods = await api('/specialites/' + slug + '/modules');

    sel.innerHTML = '<option value="">اختر الوحدة</option>';



    if (!mods?.length) {

      sel.innerHTML = '<option value="">لا توجد وحدات لهذا التخصص</option>';



      return;
    }
    mods.forEach(m => 
      sel.appendChild(opt(m.id, `${m.nom} (${m.niveau})`)));

  }
   catch(e) {

    sel.innerHTML = '<option value="">اختر الوحدة</option>';

    DEMO_MODS.forEach(m => sel.appendChild(opt(m.id, `${m.nom} (${m.niveau})`)));

  }
}

function onFileSelect(input) {

  const f = input.files[0];
  if (!f) 
    return;
  if (f.type !== 'application/pdf')
    
    
    {
                         toast('  PDF فقط', 'error'); 
                         
                         input.value=''; return;
                         }
  if (f.size > 52428800) 
    {
       toast('الملف يتجاوز 50MB', 'error');
      
      input.value=''; return; }
  setEl('dropName', ` ${f.name}
     (${(f.size/1024/1024).toFixed(1)

  } MB)`
);
}

function setupDropzone() {

  const zone = document.getElementById('dropZone');
  if (!zone) 
  return;

  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('over'); 

  }
);

  zone.addEventListener('dragleave', () => zone.classList.remove('over'));

  zone.addEventListener('drop', e => {

    e.preventDefault(); zone.classList.remove('over');

    const f = e.dataTransfer.files[0];

    if (f?.type === 'application/pdf') {

      const dt = new DataTransfer();
       dt.items.add(f);

      document.getElementById('fileInput').files = dt.files;

      onFileSelect(document.getElementById('fileInput'));

    } 
    
    else toast('يُسمح بملفات PDF فقط', 'error');
  });
}

async function submitUpload() {

  const file = document.getElementById('fileInput').files[0];

  const title= getVal('upTitle').trim();

  const modId= getVal('upModule');

  const type = getVal('upType');

  if (!file)  { 

    toast('اختر ملف PDF', 'error'); return;
   }
  if (!title) { 

    toast('أدخل عنوان الوثيقة', 'error'); return; 
  }
  if (!modId) { 

    toast('اختر الوحدة', 'error'); return; 
  }

  const btn = document.getElementById('upBtn');
  

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع......';

  btn.disabled  = true;

  const fd = new FormData();

  fd.append('file', file);

  fd.append('titre', title);

  fd.append('module_id', modId);

  fd.append('type_document', type);

  fd.append('niveau', getVal('upLevel'));

  fd.append('auteur', getVal('upAuthor'));

  fd.append('universite', getVal('upUniv'));

  fd.append('annee_academique', getVal('upYear'));

  fd.append('description', getVal('upDesc'));

  try {
    const base = await initApiBase();


    const res  = await fetch(base + '/documents/upload', {
       method:'POST', body:fd 
      }
    );
    const data = await res.json().catch(() => ({

    }));
    if (res.ok) {
      toast(data.message || ' الرفع ', 'success');

      document.getElementById('fileInput').value = '';

      setEl('dropName', '');
      setInputVal('upTitle', '');

      setInputVal('upDesc', '');

    } else toast(data.message || 'خطأ', 'error');

  } catch(e) {

     toast('  الرفع —  من ', 'error'); 
    
    }
  finally {
    btn.innerHTML = '<i class="fas fa-upload"></i> رفع الوثيقة';
    btn.disabled  = false;
  }
}



  //  MODAL HELPERS
function openModal(id)  { 
  document.getElementById(id).style.display = 'flex'; document.body.style.overflow='hidden'; 
}
function closeModal(id) {
   document.getElementById(id).style.display = 'none'; document.body.style.overflow='';
   }
function switchModal(a, b) {
  
  closeModal(a); openModal(b);

   }
function toggleDropdown() {


  const dd = document.getElementById('userDropdown');

  if (dd) dd.classList.toggle('open');
}
function closeDropdown()  {
  const dd = document.getElementById('userDropdown');
  if (dd)
     dd.classList.remove('open');
}
function toggleMobile()   { 
  document.getElementById('navLinks').style.display 
  = document.getElementById('navLinks').style.display === 'flex' ? 'none' : 'flex';

}

function setupEsc() {

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDropdown();

    }

  });
}
function setupOutsideClick() {

  document.addEventListener('click', e => {

    if (!e.target.closest('#navUser')) 
      
      closeDropdown();
  });
}


  //  TOAST

function toast(msg, type = 'success') {


  const icons = { 

    success:'', error:'', warning:'', info:'' };

  const el = document.createElement('div');

  el.className = `toast ${type}`;
  el.innerHTML = `<span
  
  class="toast__icon">${icons[type]||''}</span><span>${msg}
  
  
  </span>`;

  document.getElementById('toastStack').appendChild(el);




  setTimeout(() => {

     el.style.animation = 'slideIn .25s ease reverse'; 

     
     setTimeout(
      ()=>el.remove(), 
      230
    ); 
    
    
    }, 3000);
}



  //  HELPERS
function setEl(id, val)       

{
   const el = document.getElementById(id); if(el) el.textContent = val; 



}
function setHTML(id, html)    

{ 
  const el = document.getElementById(id); if(el) el.innerHTML   = html; 


}

function setInputVal(id, val) 


{ const el = document.getElementById(id); if(el) el.value  = val; 

}
function getVal(id)           

{ return document.getElementById(id)?.value || ''; }
function esc(s)               

{ return (s||'').replace(/'/g,"\\'").replace(/"/g,'&quot;'); }
function opt(val, label)      

{ const o = document.createElement('option'); o.value=val; o.textContent=label; return o; }
function skeleton()           

{ return ''; }

function breadcrumb(items) {
  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) return `<span class="breadcrumb__current">${item.label}</span>`;
    return `<a onclick="${item.action}">${item.label}</a><span class="breadcrumb__sep">›</span>`;
  }).join('');
}

function emptyState(icon, title, sub = '') {

  return
   `<div 
   class="empty" style="grid-column:1/-1">
    <i class="${icon}"></i>
    <h4>${title}</h4>
  
    ${sub ? `<p>${sub}</p>` : ''
  
  }
  </div>`;
}







function demoDocsList() {

  const types = ['cours','td','tp','examen','correction'];
  const univs  = ['جامعة الجزائر 1','جامعة باتنة','جامعة وهران','جامعة عنابة','جامعة قسنطينة'];

  const profs  = ['أ. بن علي','أ. حمدي','أ. مراد','أ. رحيم','أ. خالد'];

  return Array.from({length:12},(_,i)=>({

    id:i   +   1,
    titre:`${TYPE[types[i%5]]} — ${moduleName} ${['2023/2024','2022/2023','2021/2022'][i%3]}`,

    type_document:types[i%5], auteur:profs[i%5], universite:univs[i%5],

    annee_academique:['2023/2024','2022/2023'][i%2],

    nb_telechargements:Math.floor(Math.random()*600+50),

    nb_vues:Math.floor(Math.random()*1200+100),

    note_moyenne:(Math.random()*2+3).toFixed(1),
    
                              nb_notes:Math.floor(Math.random()*60+5),
  }));
}
