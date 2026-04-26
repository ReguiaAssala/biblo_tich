
// require('dotenv').config();
// const express = require('express');
// const cors    = require('cors');
// const helmet  = require('helmet');
// const morgan  = require('morgan');
// const path    = require('path');

// const { globalLimiter } = require('./middleware/rateLimiter');

// const app  = express();
// const PORT = process.env.PORT || 5000;

// // ── Middleware ───────────────────────────
// app.use(helmet());
// app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));
// app.use('/api', globalLimiter);

// // ── Static files (PDFs & avatars) ────────
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ── API Routes ───────────────────────────
// app.use('/api/auth',          require('./routes/auth'));
// app.use('/api/users',         require('./routes/users'));
// app.use('/api/specialites',   require('./routes/specialites'));
// app.use('/api/modules',       require('./routes/modules'));
// app.use('/api/documents',     require('./routes/documents'));
// app.use('/api/search',        require('./routes/search'));
// app.use('/api/favoris',       require('./routes/favoris'));
// app.use('/api/notes',         require('./routes/notes'));
// app.use('/api/stats',         require('./routes/stats'));
// app.use('/api/annonces',      require('./routes/annonces'));
// app.use('/api/commentaires',  require('./routes/commentaires'));
// app.use('/api/notifications', require('./routes/notifications'));
// app.use('/api/admin',         require('./routes/admin'));

// // ── Health ───────────────────────────────
// app.get('/api/health', (req, res) => {
//   res.json({ status:'ok', message:'📚 API تعمل بنجاح', timestamp: new Date() });
// });

// // ── 404 ──────────────────────────────────
// app.use((req, res) => res.status(404).json({ message:'المسار غير موجود' }));

// // ── Error Handler ─────────────────────────
// app.use((err, req, res, next) => {
//   console.error('❌', err.message);
//   res.status(err.status || 500).json({ message: err.message || 'خطأ داخلي' });
// });

// app.listen(PORT, () => {
//   console.log(`\n🚀 الخادم يعمل على: http://localhost:${PORT}`);
//   console.log(`📡 Health: http://localhost:${PORT}/api/health\n`);
// });
// const errorHandler = require('./middleware/errorHandler');

// app.use(errorHandler);

/**
 * server.js — المكتبة الجامعية الجزائرية
 */
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;


// ── Middleware ────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Static uploads ────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/specialites',   require('./routes/specialites'));
app.use('/api/modules',       require('./routes/modules'));
app.use('/api/documents',     require('./routes/documents'));
app.use('/api/search',        require('./routes/search'));
app.use('/api/favoris',       require('./routes/favoris'));
app.use('/api/notes',         require('./routes/notes'));
app.use('/api/stats',         require('./routes/stats'));
app.use('/api/annonces',      require('./routes/annonces'));
app.use('/api/commentaires',  require('./routes/commentaires'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin',         require('./routes/admin'));

// ── Health check ──────────────────────────



// ── Routes ────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
// ... باقي routes

// ── Health check ──────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '📚 API تعمل بنجاح', timestamp: new Date() });
});



// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.use((req, res) => res.status(404).json({ message: 'المسار غير موجود' }));



















app.use((req, res) => res.status(404).json({ message: 'المسار غير موجود' }));

// ── Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error('❌', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'الملف كبير جداً (50MB max)' });
  res.status(err.status || 500).json({ message: err.message || 'خطأ داخلي' });
});

// ── Start with DB check ───────────────────
async function start() {
  try {
    const db = require('./config/db');
    await db.query('SELECT 1');
    console.log('✅ MySQL متصل بنجاح —', process.env.DB_NAME);
  } catch (err) {
    console.error('❌ فشل الاتصال بـ MySQL:', err.message);
    console.error('   تأكد أن MySQL/MariaDB يعمل وأن قاعدة البيانات موجودة');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 الخادم يعمل على: http://localhost:' + PORT);
    console.log('📡 Health:   http://localhost:' + PORT + '/api/health');
    console.log('');
  });
}

start();