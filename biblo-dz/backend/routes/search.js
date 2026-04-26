// routes/search.js
const express = require('express');
const db      = require('../config/db');
const router  = express.Router();

// GET /api/search/documents?q=&specialite=&type=&niveau=&sort=&page=&limit=
router.get('/documents', async (req, res) => {
  try {
    const { q, specialite, type, niveau, sort='recent', page=1, limit=12 } = req.query;
    if (!q || q.trim().length < 2) return res.status(400).json({ message:'عبارة البحث يجب أن تكون حرفين على الأقل' });
    const like = `%${q.trim()}%`;
    let where = `d.approuve=1 AND (d.titre LIKE ? OR d.description LIKE ? OR d.auteur LIKE ? OR m.nom LIKE ? OR s.nom LIKE ?)`;
    const p = [like,like,like,like,like];
    if (specialite){ where+=' AND s.slug=?';          p.push(specialite); }
    if (type)      { where+=' AND d.type_document=?'; p.push(type); }
    if (niveau)    { where+=' AND d.niveau=?';        p.push(niveau); }
    const sm = { popular:'d.nb_telechargements DESC', noted:'d.note_moyenne DESC', recent:'d.created_at DESC' };
    const [[{total}]] = await db.query(`SELECT COUNT(*) AS total FROM documents d JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id WHERE ${where}`, p);
    const offset = (parseInt(page)-1)*parseInt(limit);
    const [rows] = await db.query(`SELECT d.*,m.nom AS module_nom,s.nom AS specialite_nom,s.slug AS specialite_slug,s.couleur AS specialite_couleur FROM documents d JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id WHERE ${where} ORDER BY ${sm[sort]||'d.created_at DESC'} LIMIT ? OFFSET ?`,
      [...p, parseInt(limit), offset]);
    res.json({ results:rows, total, page:parseInt(page), pages:Math.ceil(total/parseInt(limit)), query:q });
  } catch(e) { res.status(500).json({ message:e.message }); }
});

// GET /api/search/suggestions?q=algo
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ suggestions:[] });
    const like = `%${q}%`;
    const [docs] = await db.query('SELECT id,titre AS text,"document" AS type FROM documents WHERE titre LIKE ? AND approuve=1 LIMIT 4', [like]);
    const [mods] = await db.query('SELECT id,nom AS text,slug,"module" AS type FROM modules WHERE nom LIKE ? LIMIT 4', [like]);
    const [specs]= await db.query('SELECT id,nom AS text,slug,"specialite" AS type FROM specialites WHERE nom LIKE ? LIMIT 3', [like]);
    res.json({ suggestions:[...specs,...mods,...docs] });
  } catch(e) { res.status(500).json({ message:e.message }); }
});

// GET /api/search?q= (global)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.status(400).json({ message:'عبارة البحث قصيرة جداً' });
    const like = `%${q.trim()}%`;
    const [documents] = await db.query(`SELECT d.id,d.titre,d.type_document,d.niveau,s.nom AS specialite_nom,s.slug AS specialite_slug FROM documents d JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id WHERE d.approuve=1 AND (d.titre LIKE ? OR m.nom LIKE ?) ORDER BY d.nb_telechargements DESC LIMIT 6`, [like,like]);
    const [modules]   = await db.query(`SELECT m.id,m.nom,m.slug,m.niveau,s.nom AS specialite_nom,s.slug AS specialite_slug FROM modules m JOIN specialites s ON s.id=m.specialite_id WHERE m.nom LIKE ? LIMIT 5`, [like]);
    res.json({ documents, modules, query:q });
  } catch(e) { res.status(500).json({ message:e.message }); }
});

module.exports = router;
