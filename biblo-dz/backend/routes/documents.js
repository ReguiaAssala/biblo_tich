// routes/documents.js
const express = require('express');

const path = require('path');


const fs = require('fs');

const db = require('../config/db');

const { auth } = require('../middleware/auth');

const { isAdmin, isMod } = require('../middleware/isAdmin');

const { uploadPDF } = require('../config/multer');


const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();




const DOC_SQL = `
  SELECT d.*, m.nom AS module_nom,
   m.slug AS module_slug,
         s.nom AS specialite_nom,
          s.slug AS specialite_slug,
         s.couleur AS specialite_couleur,
         u.nom AS uploader_nom,
          u.prenom AS uploader_prenom
  FROM documents d
  JOIN modules m ON m.id = d.module_id

  JOIN specialites s ON s.id = m.specialite_id
  LEFT JOIN utilisateurs u ON u.id = d.uploader_id

`;





//get all ducouments sfor ca
router.get('/', async (req, res) => {
  try { 
    const {
      
      search, specialite, 
      type, niveau,
       module_id, sort =
        'recent', page = 1, limit = 12 
      
      } =
      req.query;

    let sql = DOC_SQL + ' WHERE d.approuve = 1';

    const p = [];

    if (search) {

      sql += 
      ' AND (d.titre LIKE ? OR d.description LIKE ? OR d.auteur LIKE ? OR m.nom LIKE ?)'
      ;
      const q = `%${search}%`;

      p.push(q, q, q, q);
    }

    if (specialite)
       { 
        sql += ' AND s.slug = ?'; 
        p.push(specialite); 
      
      }
    if (type) 
      { sql += ' AND d.type_document = ?';
        
        p.push(type);

       }

    if (niveau) 
      { 
        sql += ' AND d.niveau = ?'; 
        
        
        p.push(niveau);
       }

    if (module_id)
       { sql += ' AND d.module_id = ?'; 
        
        p.push(module_id); }

    const sortMap = {

      popular: 'd.nb_telechargements DESC',

      noted: 'd.note_moyenne DESC',

      vues: 'd.nb_vues DESC',
      recent: 'd.created_at DESC'
    };

    sql += ` ORDER BY ${sortMap[sort] || 'd.created_at DESC'}`;

    const [[{ total }]] = await db.query(

      `SELECT COUNT(*) AS total FROM documents d
       JOIN modules m ON m.id = d.module_id

       JOIN specialites s ON s.id = m.specialite_id

       WHERE d.approuve = 1`,
      []
    );

    sql += ' LIMIT ? OFFSET ?';
    p.push(parseInt(limit), 
    (parseInt(page) - 1) * parseInt(limit))
    ;


    const [rows] = await db.query(sql, p);

    res.json({
      documents: rows,
      total,

      page: parseInt(page),

      pages: 
      
      Math.ceil(total / parseInt(limit))

    });

  } catch (e) {

    res.status(500).json({ 

      message: e.message 
    
    });
  }
});



router.get('/featured', async (req, res) => {
  try {

    const [rows] = await db.query(

      DOC_SQL + ' WHERE d.featured = 1 AND d.approuve = 1 ORDER BY d.nb_telechargements DESC LIMIT 8'
    );

    res.json(rows);

  } catch (e) {

    res.status(500).json({

       message: e.message
      
      
      });
  }
});



router.get('/admin/pending', auth, isMod, async (req, res) => {
  try {

    const [rows] = await db.query(DOC_SQL + ' WHERE d.approuve = 0 ORDER BY d.created_at DESC');

    res.json(rows);

  } catch (e) {

    res.status(500).json({

       message: e.message 

      
      });
  }
});



router.get('/:id', auth, async (req, res) => {
  try {

    const [rows] = await db.query(DOC_SQL + ' WHERE d.id = ?', [req.params.id]);

    if (!rows.length)

      return res.status(404).json({ 
        message: 'الوثيقة  '
      
      }
    );

    await db.query('UPDATE documents SET nb_vues = nb_vues + 1 WHERE id = ?',
       [req.params.id])
       
       ;

    let isFav = false;

    let myNote = null;


    const [[fv]] = await db.query(
      'SELECT id FROM favoris WHERE utilisateur_id=? AND document_id=?',
      [req.user.id, req.params.id]
    );

    isFav = !!fv;

    const [[nt]] = await db.query(

      'SELECT note, commentaire FROM notes_documents WHERE utilisateur_id=? AND document_id=?',

      [req.user.id, req.params.id]


    );

    myNote = nt || null;

    res.json({ ...rows[0], isFav, myNote });

  } catch (e) {

    res.status(500).json({ message: e.message });
  }
});



router.get('/:id/download', async (req, res) => {
  try {

    const [rows] = await db.query(

      'SELECT * FROM documents WHERE id=? AND approuve=1',

      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ 

    message: 'الوثيقة  '

  
  });

    const doc = rows[0];

    await db.query(
      'UPDATE documents SET nb_telechargements = nb_telechargements + 1 WHERE id=?',
      [doc.id]
    );


    const fp = path.join(__dirname, '..', doc.fichier_path);


    if (!fs.existsSync(fp))

      return res.status(404).json({
        


        message: 'الملف غير موجود' 
      
      
      });

    res.download(fp, doc.fichier_nom);


  } catch (e) {


    res.status(500).json({ 
      

      message: e.message 

    
    });
  }
});




router.post(
  '/upload',
  auth,
  uploadLimiter,
  uploadPDF.single('file'),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: 'ملف PDF مطلوب' });

      const {
        module_id,
        titre,
        type_document,
        niveau,
        auteur,
        universite,
        annee_academique,
        description
      } = req.body;

      const fichier_path = `/uploads/docs/${req.file.filename}`;

      const [r] = await db.query(
        `INSERT INTO documents
        (module_id,titre,description,auteur,universite,annee_academique,
         type_document,niveau,fichier_path,fichier_nom,taille_fichier,uploader_id,approuve)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0)`,
        [
          module_id,
          titre,
          description || null,
          auteur || null,
          universite || null,
          annee_academique || null,
          type_document,
          niveau || 'L1',
          fichier_path,
          req.file.originalname,
          req.file.size,
          req.user.id
        ]
      );

      res.status(201).json({
        id: r.insertId,
        message: 'تم رفع الوثيقة 🎉'
      });

    } catch (e) {
      if (req.file) fs.unlink(req.file.path, () => {});
      res.status(500).json({ message: e.message });
    }
  }
);

// ────────────────────────────────
// Rate
// ────────────────────────────────
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { note, commentaire } = req.body;

    if (!note || note < 1 || note > 5)
      return res.status(400).json({ message: '1 - 5 فقط' });

    await db.query(
      `INSERT INTO notes_documents (document_id, utilisateur_id, note, commentaire)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE note=VALUES(note), commentaire=VALUES(commentaire)`,
      [req.params.id, req.user.id, note, commentaire || null]
    );

    res.json({ message: 'شكراً ⭐' });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ────────────────────────────────
// Delete
// ────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT fichier_path,uploader_id FROM documents WHERE id=?',
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: 'غير موجود' });

    if (rows[0].uploader_id !== req.user.id)
      return res.status(403).json({ message: 'غير مصرح' });

    const fp = path.join(__dirname, '..', rows[0].fichier_path);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);

    await db.query('DELETE FROM documents WHERE id=?', [req.params.id]);

    res.json({ message: 'تم الحذف' });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ────────────────────────────────
// Admin actions
// ────────────────────────────────
router.put('/admin/:id/approuver', auth, isMod, async (req, res) => {
  await db.query('UPDATE documents SET approuve=1 WHERE id=?', [req.params.id]);
  res.json({ message: 'OK' });
});

router.put('/admin/:id/featured', auth, isAdmin, async (req, res) => {
  await db.query('UPDATE documents SET featured=? WHERE id=?',
    [req.body.featured ? 1 : 0, req.params.id]);
  res.json({ message: 'OK' });
});

module.exports = router;