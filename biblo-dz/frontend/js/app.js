/* ═══════════════════════════════════════════════
   بيبليو DZ — app.js
   منظم وبسيط — كل دالة في مكانها
═══════════════════════════════════════════════ */

// ─── CONFIG ──────────────────────────────────
const API = 'http://localhost:5000/api';

// ─── STATE ───────────────────────────────────
let token       = localStorage.getItem('token');
let currentUser = null;
let specSlug    = '';
let moduleId    = null;
let moduleName  = '';
let docFilter   = { type:'', sort:'recent' };
let searchPage  = 1;
let allSpecs    = [];
let allMods     = [];

// ─── TYPE LABELS ─────────────────────────────
const TYPE = {
  cours:'محاضرة', td:'TD', tp:'TP',
  examen:'امتحان', correction:'تصحيح',
  these:'أطروحة', resume:'ملخص', rapport:'تقرير'
};

// ─── SPECIALITES DATA (fallback) ─────────────
const SPECS = [
  {id:1,  nom:'Médecine',              slug:'medecine',            icone:'fas fa-heartbeat',       couleur:'#e74c3c', nb_modules:30, description:'1ère à 6ème année, toutes les spécialités'},
  {id:2,  nom:'Science et Technologie',slug:'science-technologie', icone:'fas fa-atom',            couleur:'#3498db', nb_modules:20, description:'Physique, Chimie, Maths, Analyse...'},
  {id:3,  nom:'Biologie',             slug:'biologie',            icone:'fas fa-dna',             couleur:'#27ae60', nb_modules:15, description:'SNV, Biochimie, Microbiologie, Génétique...'},
  {id:4,  nom:'Pharmacie',            slug:'pharmacie',           icone:'fas fa-pills',           couleur:'#9b59b6', nb_modules:12, description:'Pharmacologie, Galénique, Infectiologie...'},
  {id:5,  nom:'Informatique',         slug:'informatique',        icone:'fas fa-laptop-code',     couleur:'#2980b9', nb_modules:52, description:'IA, Réseaux, GL, Bases de données, Programmation...'},
  {id:6,  nom:'Sciences de la Matière',slug:'sciences-matiere',   icone:'fas fa-flask',           couleur:'#f39c12', nb_modules:14, description:'Physique, Acoustique, Thermodynamique...'},
  {id:7,  nom:'Chimie',               slug:'chimie',              icone:'fas fa-vial',            couleur:'#1abc9c', nb_modules:16, description:'Fondamentale, Analytique, Polymères...'},
  {id:8,  nom:'Physique',             slug:'physique',            icone:'fas fa-satellite',       couleur:'#e67e22', nb_modules:14, description:'Théorique, Nucléaire, Nano...'},
  {id:9,  nom:'Génie des Procédés',   slug:'genie-procedes',      icone:'fas fa-industry',        couleur:'#95a5a6', nb_modules:10, description:'Pétrochimie, Alimentaire...'},
  {id:10, nom:'Génie Civil',          slug:'genie-civil',         icone:'fas fa-hard-hat',        couleur:'#7f8c8d', nb_modules:14, description:'Structures, Travaux Publics, Géotechnique...'},
  {id:11, nom:'Génie Mécanique',      slug:'genie-mecanique',     icone:'fas fa-cogs',            couleur:'#34495e', nb_modules:12, description:'Aéronautique, Fabrication, Matériaux...'},
  {id:12, nom:'Hydraulique',          slug:'hydraulique',         icone:'fas fa-water',           couleur:'#2471a3', nb_modules:8,  description:'Gestion des eaux, Assainissement...'},
  {id:13, nom:'Electronique',         slug:'electronique',        icone:'fas fa-microchip',       couleur:'#8e44ad', nb_modules:12, description:'Microélectronique, Systèmes embarqués...'},
  {id:14, nom:'Automatique',          slug:'automatique',         icone:'fas fa-robot',           couleur:'#16a085', nb_modules:10, description:'Robotique, Systèmes automatisés...'},
  {id:15, nom:'Télécommunication',    slug:'telecommunication',   icone:'fas fa-broadcast-tower', couleur:'#2e86c1', nb_modules:12, description:'Signaux, Réseaux, Radio, Internet...'},
  {id:16, nom:'Electrotechnique',     slug:'electrotechnique',    icone:'fas fa-bolt',            couleur:'#d68910', nb_modules:10, description:'Machines Électriques, Réseaux...'},
  {id:17, nom:'Sciences Économiques', slug:'sciences-economiques',icone:'fas fa-chart-line',      couleur:'#148f77', nb_modules:14, description:'Macro, Micro économie, Econométrie...'},
  {id:18, nom:'Sciences De Gestion',  slug:'sciences-gestion',    icone:'fas fa-briefcase',       couleur:'#943126', nb_modules:12, description:'Finance, Marketing, GRH, Management...'},
];

const DEMO_MODS = [
  {id:1, nom:'Algorithmique 1',                  niveau:'L1', nb_documents:20},
  {id:2, nom:'Algorithmique 2',                  niveau:'L2', nb_documents:15},
  {id:3, nom:'Analyse 1',                        niveau:'L1', nb_documents:22},
  {id:4, nom:'Algèbre 1',                        niveau:'L1', nb_documents:19},
  {id:5, nom:'Programmation C',                  niveau:'L1', nb_documents:30},
  {id:6, nom:'Logique Mathématique',             niveau:'L1', nb_documents:12},
  {id:7, nom:'Algorithmique et Structures',      niveau:'L2', nb_documents:18},
  {id:8, nom:'Programmation C++',                niveau:'L2', nb_documents:24},
  {id:9, nom:'Programmation Java',               niveau:'L2', nb_documents:26},
  {id:10,nom:'Base de données 1',                niveau:'L2', nb_documents:22},
  {id:11,nom:'Réseaux Informatiques 1',          niveau:'L2', nb_documents:21},
  {id:12,nom:'Systèmes d\'Exploitation 1',       niveau:'L2', nb_documents:23},
  {id:13,nom:'Probabilités et Statistiques',     niveau:'L2', nb_documents:19},
  {id:14,nom:'Analyse numérique',                niveau:'L2', nb_documents:16},
  {id:15,nom:'Génie Logiciel',                   niveau:'L3', nb_documents:19},
  {id:16,nom:'Base de données 2',                niveau:'L3', nb_documents:17},
  {id:17,nom:'Développement Web',                niveau:'L3', nb_documents:20},
  {id:18,nom:'Réseaux Informatiques 2',          niveau:'L3', nb_documents:18},
  {id:19,nom:'Compilation',                      niveau:'L3', nb_documents:10},
  {id:20,nom:'Théorie des Graphes',              niveau:'L3', nb_documents:14},
  {id:21,nom:'Programmation Python',             niveau:'L3', nb_documents:22},
  {id:22,nom:'Génie Logiciel',                   niveau:'L3', nb_documents:19},
  {id:23,nom:'Apprentissage Automatique',        niveau:'M1', nb_documents:13},
  {id:24,nom:'Intelligence Artificielle',        niveau:'M1', nb_documents:16},
  {id:25,nom:'Sécurité Informatique',            niveau:'M1', nb_documents:11},
  {id:26,nom:'Développement Mobile',             niveau:'M1', nb_documents:12},
  {id:27,nom:'Cryptographie',                    niveau:'M1', nb_documents:9},
  {id:28,nom:'Algorithmique Avancée',            niveau:'M2', nb_documents:8},
  {id:29,nom:'Apprentissage Profond',            niveau:'M2', nb_documents:8},
  {id:30,nom:'Vision par Ordinateur',            niveau:'M2', nb_documents:7},
  {id:31,nom:'Sujets Doctorat',                  niveau:'Doctorat', nb_documents:5},
];

const MOD_ICONS = [
  'fas fa-server','fas fa-code','fas fa-brain','fas fa-globe','fas fa-database',
  'fas fa-project-diagram','fas fa-chart-bar','fas fa-terminal','fas fa-microchip',
  'fas fa-shield-alt','fas fa-network-wired','fas fa-laptop','fas fa-cog',
  'fas fa-cube','fas fa-infinity','fas fa-sitemap','fas fa-code-branch',
  'fas fa-calculator','fas fa-wave-square','fas fa-puzzle-piece',
  'fas fa-flask','fas fa-graduation-cap','fas fa-scroll','fas fa-book',
];

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await loadSpecs();
  renderHomeSpecs();
  renderAllSpecs();
  loadFeaturedDocs();
  loadStats();
  populateSearchSpecs();
  populateUploadSpecs();
  if (token) await loadMe();
  setupDropzone();
  setupEsc();
  setupOutsideClick();
});

/* ════════════════════════════════════════════
   API HELPER
════════════════════════════════════════════ */
async function api(url, opts = {}) {
  const res = await fetch(API + url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...opts.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'خطأ في الخادم');
  return data;
}

/* ════════════════════════════════════════════
   PAGES / NAVIGATION
════════════════════════════════════════════ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + name);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active nav link
  document.querySelectorAll('.nav__link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });

  // Trigger page-specific load
  const actions = {
    home:       () => { renderHomeSpecs(); loadFeaturedDocs(); },
    specialites:() => renderAllSpecs(),
    favorites:  () => currentUser && loadFavs(),
    'my-uploads':()=> currentUser && loadMyUploads(),
    profile:    () => { if(currentUser){ renderProfile(); loadProfileStats(); } },
    admin:      () => currentUser?.role === 'admin' && loadAdminStats(),
    upload:     () => populateUploadSpecs(),
  };
  actions[name]?.();
}

/* ════════════════════════════════════════════
   STATS (hero numbers)
════════════════════════════════════════════ */
async function loadStats() {
  try {
    const s = await api('/stats/global');
    setEl('hs-docs',  s.documents?.toLocaleString('ar') || '٠');
    setEl('hs-users', s.utilisateurs?.toLocaleString('ar') || '٠');
    setEl('hs-dl',    s.telechargements?.toLocaleString('ar') || '٠');
  } catch(e) { /* keep defaults */ }
}

/* ════════════════════════════════════════════
   SPECIALITES
════════════════════════════════════════════ */
async function loadSpecs() {
  try { allSpecs = await api('/specialites'); }
  catch(e) { allSpecs = SPECS; }
}

function specCard(s) {
  return `
  <div class="spec-card" onclick="goToSpec('${s.slug}')">
    <div class="spec-card__icon" style="background:${s.couleur}18;color:${s.couleur}">
      <i class="${s.icone || 'fas fa-book'}"></i>
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

/* ════════════════════════════════════════════
   MODULES
════════════════════════════════════════════ */
async function goToSpec(slug) {
  specSlug = slug;
  showPage('modules');
  const spec = allSpecs.find(s => s.slug === slug) || { nom: slug };

  setEl('modTitle', spec.nom);
  setEl('modSub', spec.description || '');
  setHTML('modBreadcrumb', breadcrumb([
    { label: 'الرئيسية', action: "showPage('home')" },
    { label: 'التخصصات', action: "showPage('specialites')" },
    { label: spec.nom },
  ]));
  setHTML('modulesGrid', `<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>`);

  let mods = [];
  try { mods = await api('/specialites/' + slug + '/modules'); }
  catch(e) { mods = DEMO_MODS; }
  allMods = mods;

  const levels = ['L1','L2','L3','M1','M2','Doctorat'].filter(l => mods.some(m => m.niveau === l));
  setHTML('levelTabs',
    `<button class="level-tab active" onclick="filterLevel('',this)">الكل (${mods.length})</button>` +
    levels.map(l =>
      `<button class="level-tab" onclick="filterLevel('${l}',this)">${l} (${mods.filter(m=>m.niveau===l).length})</button>`
    ).join('')
  );
  renderMods(mods);
}

function filterLevel(level, btn) {
  document.querySelectorAll('.level-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMods(level ? allMods.filter(m => m.niveau === level) : allMods);
}

function renderMods(mods) {
  if (!mods.length) {
    setHTML('modulesGrid', emptyState('fas fa-folder-open', 'لا توجد وحدات في هذا المستوى'));
    return;
  }
  setHTML('modulesGrid', mods.map((m, i) => `
    <div class="module-card" onclick="goToModule(${m.id},'${esc(m.nom)}')">
      <div class="module-card__icon"><i class="${MOD_ICONS[i % MOD_ICONS.length]}"></i></div>
      <div>
        <p class="module-card__name">${m.nom}</p>
        <p class="module-card__count"><i class="fas fa-file-pdf"></i> ${m.nb_documents || 0} وثيقة</p>
      </div>
    </div>`).join('')
  );
}

/* ════════════════════════════════════════════
   DOCUMENTS
════════════════════════════════════════════ */
async function goToModule(id, name) {
  moduleId   = id;
  moduleName = name;
  docFilter  = { type: '', sort: 'recent' };
  showPage('documents');

  const spec = allSpecs.find(s => s.slug === specSlug) || { nom: specSlug };
  setEl('docTitle', name);
  setEl('docSub', spec.nom + ' — وثائق الوحدة');
  setHTML('docBreadcrumb', breadcrumb([
    { label: 'الرئيسية',  action: "showPage('home')" },
    { label: spec.nom,    action: `goToSpec('${specSlug}')` },
    { label: name },
  ]));

  // reset filter chips
  document.querySelectorAll('#typeFilters .chip').forEach((c,i) => c.classList.toggle('active', i===0));
  loadDocs();
}

async function loadDocs() {
  setHTML('docsGrid', `<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>`);
  try {
    const p = new URLSearchParams({ module_id: moduleId, ...docFilter, limit: 24 });
    const d = await api('/documents?' + p);
    renderDocCards('docsGrid', d.documents || d || []);
  } catch(e) {
    renderDocCards('docsGrid', demoDocsList());
  }
}

function filterType(type, btn) {
  document.querySelectorAll('#typeFilters .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  docFilter.type = type;
  loadDocs();
}

function sortDocs(sort) {
  docFilter.sort = sort;
  loadDocs();
}

function renderDocCards(containerId, docs) {
  if (!docs?.length) {
    setHTML(containerId, emptyState('fas fa-file-pdf', 'لا توجد وثائق', 'كن أول من يشارك وثيقة!'));
    return;
  }
  setHTML(containerId, docs.map(d => {
    const stars = [1,2,3,4,5].map(i =>
      `<i class="fas fa-star ${i <= Math.round(d.note_moyenne||0) ? 'star-on' : 'star-off'}"></i>`
    ).join('');
    return `
    <div class="doc-card">
      <div class="doc-card__head">
        <div class="doc-card__pdf-icon"><i class="fas fa-file-pdf"></i></div>
        <span class="doc-card__type-badge">${TYPE[d.type_document] || d.type_document || ''}</span>
        <p class="doc-card__title">${d.titre || ''}</p>
      </div>
      <div class="doc-card__body">
        <div class="doc-card__stars">${stars}<span class="doc-card__rating-count">(${d.nb_notes||0})</span></div>
        <div class="doc-card__meta">
          ${d.auteur           ? `<div class="doc-card__meta-row"><i class="fas fa-user"></i>${d.auteur}</div>` : ''}
          ${d.universite       ? `<div class="doc-card__meta-row"><i class="fas fa-university"></i>${d.universite}</div>` : ''}
          ${d.annee_academique ? `<div class="doc-card__meta-row"><i class="fas fa-calendar"></i>${d.annee_academique}</div>` : ''}
          <div class="doc-card__meta-row"><i class="fas fa-download"></i>${(d.nb_telechargements||0).toLocaleString()} تحميل</div>
        </div>
        <div class="doc-card__actions">
          <button class="btn-dl" onclick="dlDoc(${d.id},'${esc(d.titre||'')}')"><i class="fas fa-download"></i> تحميل</button>
          <button class="btn-fav" id="fav-${d.id}" onclick="toggleFav(${d.id},this)"><i class="far fa-heart"></i></button>
        </div>
      </div>
    </div>`;
  }).join(''));
}

/* ════════════════════════════════════════════
   FEATURED DOCS
════════════════════════════════════════════ */
async function loadFeaturedDocs() {
  try {
    const docs = await api('/stats/top-documents?limit=8');
    renderDocCards('featuredDocs', docs);
  } catch(e) {
    setHTML('featuredDocs', `
      <div class="empty" style="grid-column:1/-1">
        <i class="fas fa-plug"></i>
        <h4>الوثائق ستظهر هنا بعد ربط الخادم</h4>
        <p>شغّل الـ backend على المنفذ 5000</p>
      </div>`);
  }
}

/* ════════════════════════════════════════════
   DOWNLOAD
════════════════════════════════════════════ */
async function dlDoc(id, title) {
  toast('جاري التحميل...', 'info');
  try {
    const res = await fetch(`${API}/documents/${id}/download`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {}
    });
    if (!res.ok) { toast('خطأ في التحميل', 'error'); return; }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: (title || 'document') + '.pdf' });
    a.click(); URL.revokeObjectURL(url);
    toast('تم التحميل بنجاح ✅', 'success');
  } catch(e) { toast('تعذّر التحميل — تأكد من تشغيل الخادم', 'error'); }
}

/* ════════════════════════════════════════════
   SEARCH
════════════════════════════════════════════ */
function heroSearch() {
  const q = getVal('heroQ').trim();
  if (!q) { toast('أدخل كلمة بحث', 'warning'); return; }
  setInputVal('searchQ', q);
  showPage('search');
  doSearch();
}

function populateSearchSpecs() {
  const sel = document.getElementById('searchSpec');
  if (!sel) return;
  allSpecs.forEach(s => sel.appendChild(opt(s.slug, s.nom)));
}

async function doSearch() {
  const q    = getVal('searchQ').trim();
  const spec = getVal('searchSpec');
  const type = getVal('searchType');
  const lvl  = getVal('searchLevel');

  if (!q) { setEl('searchInfo', 'أدخل كلمة بحث'); setHTML('searchResults',''); return; }
  setHTML('searchResults', `<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>`);
  setEl('searchInfo', '');
  setHTML('searchPager', '');

  try {
    const p = new URLSearchParams({ search: q, specialite: spec, type, niveau: lvl, page: searchPage, limit: 20 });
    const d = await api('/documents?' + p);
    setEl('searchInfo', `تم العثور على ${d.total || 0} وثيقة`);
    renderDocCards('searchResults', d.documents || []);
    buildPager(d.pages || 1, searchPage);
  } catch(e) {
    setEl('searchInfo', 'خطأ — تأكد من تشغيل الخادم');
    setHTML('searchResults', emptyState('fas fa-search', 'لا نتائج'));
  }
}

function buildPager(total, current) {
  if (total <= 1) return;
  const html = Array.from({length: Math.min(total,10)}, (_,i) => i+1)
    .map(i => `<button class="chip ${i===current?'active':''}" onclick="gotoPage(${i})">${i}</button>`)
    .join('');
  setHTML('searchPager', html);
}
function gotoPage(p) { searchPage = p; doSearch(); }

/* ════════════════════════════════════════════
   UPLOAD
════════════════════════════════════════════ */
function populateUploadSpecs() {
  const sel = document.getElementById('upSpec');
  if (!sel || sel.options.length > 1) return;
  allSpecs.forEach(s => sel.appendChild(opt(s.slug, s.nom)));
}

async function loadModsForUpload() {
  const slug = getVal('upSpec');
  const sel  = document.getElementById('upModule');
  if (!slug) { sel.innerHTML = '<option value="">اختر التخصص أولاً</option>'; return; }
  sel.innerHTML = '<option value="">جاري التحميل...</option>';
  try {
    const mods = await api('/specialites/' + slug + '/modules');
    sel.innerHTML = '<option value="">اختر الوحدة</option>';
    mods.forEach(m => sel.appendChild(opt(m.id, `${m.nom} (${m.niveau})`)));
  } catch(e) {
    sel.innerHTML = '<option value="">اختر الوحدة</option>';
    DEMO_MODS.forEach(m => sel.appendChild(opt(m.id, `${m.nom} (${m.niveau})`)));
  }
}

function onFileSelect(input) {
  const f = input.files[0];
  if (!f) return;
  if (f.type !== 'application/pdf') { toast('يُسمح بملفات PDF فقط', 'error'); input.value=''; return; }
  if (f.size > 52428800) { toast('الملف يتجاوز 50MB', 'error'); input.value=''; return; }
  setEl('dropName', `✅ ${f.name} (${(f.size/1024/1024).toFixed(1)} MB)`);
}

function setupDropzone() {
  const zone = document.getElementById('dropZone');
  if (!zone) return;
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('over');
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') {
      const dt = new DataTransfer(); dt.items.add(f);
      document.getElementById('fileInput').files = dt.files;
      onFileSelect(document.getElementById('fileInput'));
    } else toast('يُسمح بملفات PDF فقط', 'error');
  });
}

async function submitUpload() {
  if (!currentUser) { openModal('loginModal'); toast('يجب تسجيل الدخول', 'warning'); return; }
  const file = document.getElementById('fileInput').files[0];
  const title= getVal('upTitle').trim();
  const modId= getVal('upModule');
  const type = getVal('upType');

  if (!file)  { toast('اختر ملف PDF', 'error'); return; }
  if (!title) { toast('أدخل عنوان الوثيقة', 'error'); return; }
  if (!modId) { toast('اختر الوحدة', 'error'); return; }

  const btn = document.getElementById('upBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';
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
    const res  = await fetch(API + '/documents/upload', { method:'POST', headers:{ Authorization:'Bearer '+token }, body:fd });
    const data = await res.json();
    if (res.ok) {
      toast(data.message || 'تم الرفع 🎉', 'success');
      document.getElementById('fileInput').value = '';
      setEl('dropName', '');
      setInputVal('upTitle', '');
      setInputVal('upDesc', '');
    } else toast(data.message || 'خطأ', 'error');
  } catch(e) { toast('خطأ في الرفع — تأكد من الخادم', 'error'); }
  finally {
    btn.innerHTML = '<i class="fas fa-upload"></i> رفع الوثيقة';
    btn.disabled  = false;
  }
}

/* ════════════════════════════════════════════
   FAVORITES
════════════════════════════════════════════ */
async function toggleFav(id, btn) {
  if (!currentUser) { openModal('loginModal'); toast('يجب تسجيل الدخول', 'warning'); return; }
  const on = btn.classList.contains('on');
  try {
    await api('/favoris/' + id, { method: on ? 'DELETE' : 'POST' });
    btn.classList.toggle('on', !on);
    btn.innerHTML = on ? '<i class="far fa-heart"></i>' : '<i class="fas fa-heart"></i>';
    if (!on) toast('أُضيف إلى المفضلة ❤️', 'success');
  } catch(e) { toast('خطأ', 'error'); }
}

async function loadFavs() {
  setHTML('favsGrid', `<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>`);
  try {
    const docs = await api('/favoris');
    if (!docs.length) { setHTML('favsGrid', emptyState('fas fa-heart-broken','المفضلة فارغة','أضف وثائق بالنقر على القلب')); return; }
    renderDocCards('favsGrid', docs);
  } catch(e) { setHTML('favsGrid', emptyState('fas fa-heart-broken','تعذّر التحميل')); }
}

async function loadMyUploads() {
  setHTML('myUploadsGrid', `<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>`);
  try {
    const docs = await api('/users/my-uploads');
    if (!docs.length) { setHTML('myUploadsGrid', emptyState('fas fa-file-upload','لم تقم برفع أي وثيقة بعد')); return; }
    renderDocCards('myUploadsGrid', docs);
  } catch(e) { setHTML('myUploadsGrid', emptyState('fas fa-file-upload','تعذّر التحميل')); }
}

/* ════════════════════════════════════════════
   AUTH
════════════════════════════════════════════ */
async function doLogin() {
  const email = getVal('loginEmail').trim();
  const pwd   = getVal('loginPwd');
  if (!email || !pwd) { toast('يرجى ملء جميع الحقول', 'error'); return; }
  try {
    const d = await api('/auth/login', { method:'POST', body: JSON.stringify({ email, mot_de_passe: pwd }) });
    token = d.token; localStorage.setItem('token', token);
    currentUser = d.user;
    updateAuthUI();
    closeModal('loginModal');
    toast(`مرحباً ${d.user.prenom}! 👋`, 'success');
  } catch(e) { toast(e.message || 'بيانات خاطئة', 'error'); }
}

async function doRegister() {
  const nom    = getVal('regNom').trim();
  const prenom = getVal('regPrenom').trim();
  const email  = getVal('regEmail').trim();
  const pwd    = getVal('regPwd');
  const univ   = getVal('regUniv').trim();
  if (!nom || !prenom || !email || !pwd) { toast('الحقول المميزة بـ * إلزامية', 'error'); return; }
  if (pwd.length < 8) { toast('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error'); return; }
  try {
    const d = await api('/auth/register', { method:'POST', body: JSON.stringify({ nom, prenom, email, mot_de_passe: pwd, universite: univ }) });
    token = d.token; localStorage.setItem('token', token);
    currentUser = d.user;
    updateAuthUI();
    closeModal('registerModal');
    toast('مرحباً بك! تم إنشاء حسابك 🎉', 'success');
  } catch(e) { toast(e.message || 'خطأ في إنشاء الحساب', 'error'); }
}

async function loadMe() {
  try { currentUser = await api('/auth/me'); updateAuthUI(); }
  catch(e) { token = null; localStorage.removeItem('token'); }
}

function updateAuthUI() {
  const hasUser = !!currentUser;
  document.getElementById('navAuth').style.display = hasUser ? 'none' : 'flex';
  document.getElementById('navUser').style.display = hasUser ? 'flex' : 'none';
  if (hasUser) {
    const initials = ((currentUser.prenom||'')[0] || '') + ((currentUser.nom||'')[0] || '');
    setEl('navAvatar', initials.toUpperCase() || 'م');
    const adminLink = document.getElementById('adminLink');
    if (adminLink) adminLink.style.display = ['admin','moderateur'].includes(currentUser.role) ? 'flex' : 'none';
  }
}

function logout() {
  token = null; currentUser = null;
  localStorage.removeItem('token');
  updateAuthUI();
  closeDropdown();
  showPage('home');
  toast('تم تسجيل الخروج', 'info');
}

/* ════════════════════════════════════════════
   PROFILE
════════════════════════════════════════════ */
function renderProfile() {
  if (!currentUser) return;
  const initials = ((currentUser.prenom||'')[0]||'') + ((currentUser.nom||'')[0]||'');
  setEl('profileAv', initials.toUpperCase() || 'م');
  setEl('profileName', `${currentUser.prenom||''} ${currentUser.nom||''}`);
  const roleMap = { admin:'مسؤول', moderateur:'مشرف', etudiant:'طالب' };
  setEl('profileBadge', roleMap[currentUser.role] || 'طالب');
  setInputVal('profNom',    currentUser.nom || '');
  setInputVal('profPrenom', currentUser.prenom || '');
  setInputVal('profUniv',   currentUser.universite || '');
  setInputVal('profWilaya', currentUser.wilaya || '');
}

async function loadProfileStats() {
  try {
    const s = await api('/users/stats');
    setEl('ps-up',  s.uploads   || 0);
    setEl('ps-dl',  s.downloads || 0);
    setEl('ps-fav', s.favorites || 0);
  } catch(e) {}
}

async function saveProfile() {
  const body = {
    nom:       getVal('profNom').trim(),
    prenom:    getVal('profPrenom').trim(),
    universite:getVal('profUniv').trim(),
    wilaya:    getVal('profWilaya').trim(),
  };
  try {
    await api('/users/profile', { method:'PUT', body: JSON.stringify(body) });
    currentUser = { ...currentUser, ...body };
    updateAuthUI();
    toast('تم حفظ التعديلات ✅', 'success');
  } catch(e) { toast(e.message || 'خطأ في الحفظ', 'error'); }
}

/* ════════════════════════════════════════════
   ADMIN
════════════════════════════════════════════ */
async function loadAdminStats() {
  const c = document.getElementById('adminContent');
  c.innerHTML = `
    <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:1.25rem">📊 إحصاءات</h2>
    <div class="admin-stats">
      <div class="admin-stat-card" style="background:linear-gradient(135deg,#1a3a6e,#2563b0)">
        <div class="admin-stat-card__num" id="as-docs">...</div>
        <div class="admin-stat-card__lbl">وثيقة</div>
      </div>
      <div class="admin-stat-card" style="background:linear-gradient(135deg,#10b981,#059669)">
        <div class="admin-stat-card__num" id="as-users">...</div>
        <div class="admin-stat-card__lbl">مستخدم</div>
      </div>
      <div class="admin-stat-card" style="background:linear-gradient(135deg,#f59e0b,#d97706)">
        <div class="admin-stat-card__num" id="as-dl">...</div>
        <div class="admin-stat-card__lbl">تحميل</div>
      </div>
      <div class="admin-stat-card" style="background:linear-gradient(135deg,#ef4444,#dc2626)">
        <div class="admin-stat-card__num" id="as-pend">...</div>
        <div class="admin-stat-card__lbl">في الانتظار</div>
      </div>
    </div>
    <div class="card">
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:1rem">🏆 أعلى الوثائق تحميلاً</h3>
      <div id="topTable"><div class="spinner"></div></div>
    </div>`;
  try {
    const s = await api('/stats/global');
    setEl('as-docs',  s.documents?.toLocaleString() || 0);
    setEl('as-users', s.utilisateurs?.toLocaleString() || 0);
    setEl('as-dl',    s.telechargements?.toLocaleString() || 0);
    setEl('as-pend',  s.pending || 0);
    const top = await api('/stats/top-documents');
    setHTML('topTable', `<div class="table-wrap"><table>
      <thead><tr><th>العنوان</th><th>التخصص</th><th>النوع</th><th>تحميل</th></tr></thead>
      <tbody>${top.map(d => `<tr>
        <td>${d.titre}</td>
        <td style="color:#64748b;font-size:.78rem">${d.specialite_nom||''}</td>
        <td><span class="badge">${TYPE[d.type_document]||d.type_document}</span></td>
        <td><b>${d.nb_telechargements||0}</b></td>
      </tr>`).join('')}</tbody>
    </table></div>`);
  } catch(e) { setEl('as-docs','—'); }
}

async function adminSection(section, el) {
  document.querySelectorAll('.admin-sidebar__link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');
  if (section === 'stats')  return loadAdminStats();
  if (section === 'pending')return loadAdminPending();
  if (section === 'docs')   return loadAdminDocs();
  if (section === 'users')  return loadAdminUsers();
}

async function loadAdminPending() {
  const c = document.getElementById('adminContent');
  c.innerHTML = '<h2 style="font-size:1.4rem;font-weight:800;margin-bottom:1.25rem">⏳ وثائق في الانتظار</h2><div id="pendList"><div class="spinner"></div></div>';
  try {
    const docs = await api('/documents/admin/pending');
    if (!docs.length) { setHTML('pendList','<div class="card" style="text-align:center;color:#94a3b8;padding:2rem">🎉 لا توجد وثائق في الانتظار</div>'); return; }
    setHTML('pendList', `<div class="card table-wrap"><table>
      <thead><tr><th>العنوان</th><th>النوع</th><th>الرافع</th><th>التاريخ</th><th>إجراء</th></tr></thead>
      <tbody>${docs.map(d=>`<tr>
        <td>${d.titre}</td>
        <td><span class="badge">${TYPE[d.type_document]||d.type_document}</span></td>
        <td>${d.uploader_prenom||''} ${d.uploader_nom||''}</td>
        <td style="font-size:.75rem;color:#94a3b8">${new Date(d.created_at).toLocaleDateString('ar-DZ')}</td>
        <td style="display:flex;gap:.4rem">
          <button class="btn btn--primary" style="padding:.3rem .6rem;font-size:.75rem" onclick="approveDoc(${d.id})"><i class="fas fa-check"></i></button>
          <button class="btn btn--danger"  style="padding:.3rem .6rem;font-size:.75rem" onclick="delDoc(${d.id})"><i class="fas fa-times"></i></button>
        </td>
      </tr>`).join('')}</tbody>
    </table></div>`);
  } catch(e) { setHTML('pendList','<p style="color:red">خطأ في التحميل</p>'); }
}

async function loadAdminDocs() {
  const c = document.getElementById('adminContent');
  c.innerHTML = '<h2 style="font-size:1.4rem;font-weight:800;margin-bottom:1.25rem">📄 كل الوثائق</h2><div id="docsList"><div class="spinner"></div></div>';
  try {
    const data = await api('/admin/documents?limit=30');
    setHTML('docsList', `<div class="card table-wrap"><table>
      <thead><tr><th>العنوان</th><th>التخصص</th><th>النوع</th><th>الحالة</th><th>تحميل</th><th>إجراء</th></tr></thead>
      <tbody>${data.map(d=>`<tr>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.titre}</td>
        <td style="font-size:.75rem;color:#94a3b8">${d.specialite_nom||''}</td>
        <td><span class="badge">${TYPE[d.type_document]||''}</span></td>
        <td>${d.approuve ? '<span style="color:#10b981;font-size:.78rem">✅ منشور</span>' : '<span style="color:#f59e0b;font-size:.78rem">⏳ انتظار</span>'}</td>
        <td>${d.nb_telechargements||0}</td>
        <td><button class="btn btn--danger" style="padding:.3rem .6rem;font-size:.75rem" onclick="delDoc(${d.id})"><i class="fas fa-trash"></i></button></td>
      </tr>`).join('')}</tbody>
    </table></div>`);
  } catch(e) { setHTML('docsList','<p style="color:red">خطأ</p>'); }
}

async function loadAdminUsers() {
  const c = document.getElementById('adminContent');
  c.innerHTML = '<h2 style="font-size:1.4rem;font-weight:800;margin-bottom:1.25rem">👥 المستخدمون</h2><div id="uList"><div class="spinner"></div></div>';
  const roleMap = { admin:'مسؤول', moderateur:'مشرف', etudiant:'طالب' };
  try {
    const users = await api('/admin/users?limit=30');
    setHTML('uList', `<div class="card table-wrap"><table>
      <thead><tr><th>الاسم</th><th>البريد</th><th>الجامعة</th><th>الدور</th><th>التاريخ</th></tr></thead>
      <tbody>${users.map(u=>`<tr>
        <td>${u.prenom||''} ${u.nom||''}</td>
        <td style="font-size:.75rem">${u.email}</td>
        <td style="font-size:.75rem;color:#94a3b8">${u.universite||'—'}</td>
        <td><span class="badge">${roleMap[u.role]||u.role}</span></td>
        <td style="font-size:.75rem;color:#94a3b8">${new Date(u.created_at).toLocaleDateString('ar-DZ')}</td>
      </tr>`).join('')}</tbody>
    </table></div>`);
  } catch(e) { setHTML('uList','<p style="color:red">خطأ</p>'); }
}

async function approveDoc(id) {
  try { await api('/documents/admin/' + id + '/approuver', { method:'PUT' }); toast('تمت الموافقة ✅','success'); loadAdminPending(); }
  catch(e) { toast('خطأ','error'); }
}
async function delDoc(id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  try { await api('/documents/admin/' + id, { method:'DELETE' }); toast('تم الحذف','success'); loadAdminStats(); }
  catch(e) { toast('خطأ','error'); }
}

/* ════════════════════════════════════════════
   MODAL HELPERS
════════════════════════════════════════════ */
function openModal(id)  { document.getElementById(id).style.display = 'flex'; document.body.style.overflow='hidden'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; document.body.style.overflow=''; }
function switchModal(a, b) { closeModal(a); openModal(b); }
function toggleDropdown() { document.getElementById('userDropdown').classList.toggle('open'); }
function closeDropdown()  { document.getElementById('userDropdown').classList.remove('open'); }
function toggleMobile()   { document.getElementById('navLinks').style.display = document.getElementById('navLinks').style.display === 'flex' ? 'none' : 'flex'; }

function setupEsc() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['loginModal','registerModal'].forEach(id => {
        if (document.getElementById(id)?.style.display !== 'none') closeModal(id);
      });
      closeDropdown();
    }
  });
}
function setupOutsideClick() {
  document.addEventListener('click', e => {
    if (!e.target.closest('#navUser')) closeDropdown();
  });
}

/* ════════════════════════════════════════════
   TOAST
════════════════════════════════════════════ */
function toast(msg, type = 'success') {
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast__icon">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  document.getElementById('toastStack').appendChild(el);
  setTimeout(() => { el.style.animation = 'slideIn .25s ease reverse'; setTimeout(()=>el.remove(), 230); }, 3000);
}

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
function setEl(id, val)       { const el = document.getElementById(id); if(el) el.textContent = val; }
function setHTML(id, html)    { const el = document.getElementById(id); if(el) el.innerHTML   = html; }
function setInputVal(id, val) { const el = document.getElementById(id); if(el) el.value       = val; }
function getVal(id)           { return document.getElementById(id)?.value || ''; }
function esc(s)               { return (s||'').replace(/'/g,"\\'").replace(/"/g,'&quot;'); }
function opt(val, label)      { const o = document.createElement('option'); o.value=val; o.textContent=label; return o; }
function skeleton()           { return ''; }

function breadcrumb(items) {
  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) return `<span class="breadcrumb__current">${item.label}</span>`;
    return `<a onclick="${item.action}">${item.label}</a><span class="breadcrumb__sep">›</span>`;
  }).join('');
}

function emptyState(icon, title, sub = '') {
  return `<div class="empty" style="grid-column:1/-1">
    <i class="${icon}"></i>
    <h4>${title}</h4>
    ${sub ? `<p>${sub}</p>` : ''}
  </div>`;
}

function demoDocsList() {
  const types = ['cours','td','tp','examen','correction'];
  const univs  = ['جامعة الجزائر 1','جامعة باتنة','جامعة وهران','جامعة عنابة','جامعة قسنطينة'];
  const profs  = ['أ. بن علي','أ. حمدي','أ. مراد','أ. رحيم','أ. خالد'];
  return Array.from({length:12},(_,i)=>({
    id:i+1,
    titre:`${TYPE[types[i%5]]} — ${moduleName} ${['2023/2024','2022/2023','2021/2022'][i%3]}`,
    type_document:types[i%5], auteur:profs[i%5], universite:univs[i%5],
    annee_academique:['2023/2024','2022/2023'][i%2],
    nb_telechargements:Math.floor(Math.random()*600+50),
    nb_vues:Math.floor(Math.random()*1200+100),
    note_moyenne:(Math.random()*2+3).toFixed(1), nb_notes:Math.floor(Math.random()*60+5),
  }));
}
