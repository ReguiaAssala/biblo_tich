// ════════════════════════════════════════════════════
// routes/auth.js
// ════════════════════════════════════════════════════
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
const sign = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, universite, wilaya, specialite_id, annee_etude } = req.body;
    if (!nom || !prenom || !email || !mot_de_passe)
      return res.status(400).json({ message: 'الاسم، اللقب، البريد وكلمة المرور إلزامية' });
    if (mot_de_passe.length < 8)
      return res.status(400).json({ message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' });
    const [exist] = await db.query('SELECT id FROM utilisateurs WHERE email=?', [email]);
    if (exist.length) return res.status(409).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    const hash = await bcrypt.hash(mot_de_passe, 12);
    const [r] = await db.query(
      'INSERT INTO utilisateurs (nom,prenom,email,mot_de_passe,universite,wilaya,specialite_id,annee_etude) VALUES(?,?,?,?,?,?,?,?)',
      [nom, prenom, email, hash, universite||null, wilaya||null, specialite_id||null, annee_etude||null]
    );
    res.status(201).json({ token: sign(r.insertId, 'etudiant'), user: { id:r.insertId, nom, prenom, email, role:'etudiant' } });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    if (!email || !mot_de_passe) return res.status(400).json({ message: 'البريد وكلمة المرور مطلوبان' });
    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email=? AND actif=1', [email]);
    if (!rows.length || !(await bcrypt.compare(mot_de_passe, rows[0].mot_de_passe)))
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    const u = rows[0];
    res.json({ token: sign(u.id, u.role), user: { id:u.id, nom:u.nom, prenom:u.prenom, email:u.email, role:u.role, avatar:u.avatar } });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id,nom,prenom,email,role,universite,wilaya,specialite_id,annee_etude,avatar,created_at FROM utilisateurs WHERE id=?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'المستخدم غير موجود' });
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// POST /api/auth/change-password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
    if (!ancien_mot_de_passe || !nouveau_mot_de_passe)
      return res.status(400).json({ message: 'كلمتا المرور مطلوبتان' });
    const [rows] = await db.query('SELECT mot_de_passe FROM utilisateurs WHERE id=?', [req.user.id]);
    if (!rows.length || !(await bcrypt.compare(ancien_mot_de_passe, rows[0].mot_de_passe)))
      return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    if (nouveau_mot_de_passe.length < 8)
      return res.status(400).json({ message: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف' });
    const hash = await bcrypt.hash(nouveau_mot_de_passe, 12);
    await db.query('UPDATE utilisateurs SET mot_de_passe=? WHERE id=?', [hash, req.user.id]);
    res.json({ message: 'تم تغيير كلمة المرور بنجاح ✅' });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
