// routes/documents.js
const express = require('express');

const path = require('path');


const fs = require('fs');

const db = require('../config/db');

const { uploadPDF } = require('../config/multer');

const uploadWrapper = require('../middleware/uploadWrapper');
const { relUploadPath, absFromUploadPath } = require('../config/uploads');


const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();




const DOC_SQL = `
  SELECT d.*, m.nom AS module_nom,
         m.slug AS module_slug,
         s.nom AS specialite_nom,
         s.slug AS specialite_slug,
         s.couleur AS specialite_couleur
  FROM documents d
  JOIN modules m ON m.id = d.module_id
  JOIN specialites s ON s.id = m.specialite_id
`;

function toSafeRelPath(p) {
  if (!p) return '';
  // Allow legacy values like "/uploads/docs/x.pdf" and normalize to "uploads/docs/x.pdf"
  return String(p).replace(/^\\+|^\/+/, '');
}

function safeUnlink(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, () => {});
}

async function moduleExists(moduleId) {
  if (!moduleId) return false;
  const [[row]] = await db.query('SELECT id FROM modules WHERE id=? LIMIT 1', [moduleId]);
  return !!row;
}

function pickEnum(val, allowed) {
  if (val == null) return null;
  const v = String(val);
  return allowed.includes(v) ? v : null;
}





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

    let where = ' WHERE d.approuve = 1';
    const p = [];

    if (search) {
      where +=
        ' AND (d.titre LIKE ? OR d.description LIKE ? OR d.auteur LIKE ? OR m.nom LIKE ?)';
      const q = `%${search}%`;
      p.push(q, q, q, q);
    }

    if (specialite)
       { 
        where += ' AND s.slug = ?'; 
        p.push(specialite); 
      
      }
    if (type) 
      { where += ' AND d.type_document = ?';
        
        p.push(type);

       }

    if (niveau) 
      { 
        where += ' AND d.niveau = ?'; 
        
        
        p.push(niveau);
       }

    if (module_id)
       { where += ' AND d.module_id = ?'; 
        
        p.push(module_id); }

    const sortMap = {

      popular: 'd.nb_telechargements DESC',

      noted: 'd.note_moyenne DESC',

      vues: 'd.nb_vues DESC',
      recent: 'd.created_at DESC'
    };

    const orderBy = ` ORDER BY ${sortMap[sort] || 'd.created_at DESC'}`;

    const [[{ total }]] = await db.query(
      
      `SELECT COUNT(*) AS total FROM documents d
       JOIN modules m ON m.id = d.module_id
       JOIN specialites s ON s.id = m.specialite_id
       ${where}`,
      p
    );

    let sql = DOC_SQL + where + orderBy;
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



router.get('/:id', async (req, res) => {
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

    res.json(rows[0]);

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










    const fp = absFromUploadPath(doc.fichier_path);




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







router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isFinite(id)) 
      return 
    res.status(400).json({
       message: 'معرّف الوثيقة غير صالح' 
      });

    const {
      module_id,
      titre,
      description,
      auteur,
      universite,
      annee_academique,
      type_document,
      niveau,
    } = req.body || {};

    const [rows] = await db.query('SELECT * FROM documents WHERE id=? LIMIT 1', [id]);

    if (!rows.length) 
      
      return res.status(404).json({ 
        
        
        message: ' غير موجودة'
       });

    const allowedTypes = ['cours', 'td', 'tp', 'examen', 'correction', 'these', 'rapport', 'resume'];
    const allowedLevels = ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat'];

    const updates = [];
    const params = [];

    if (module_id != null && String(module_id).trim() !== '') {
      const mid = parseInt(module_id);
      if (!Number.isFinite(mid)) return res.status(400).json({ message: 'module_id غير صالح' });
      if (!(await moduleExists(mid))) return res.status(400).json({ message: 'الوحدة غير موجودة' });
      updates.push('module_id=?');
      params.push(mid);
    }

    if (titre != null) {
      const t = String(titre).trim();
      if (!t) return res.status(400).json({ message: 'العنوان مطلوب' });
      updates.push('titre=?');
      params.push(t);
    }

    if (description !== undefined) {
      updates.push('description=?');
      params.push(description ? String(description) : null);
    }
    if (auteur !== undefined) {
      updates.push('auteur=?');
      params.push(auteur ? String(auteur) : null);
    }
    if (universite !== undefined) {
      updates.push('universite=?');
      params.push(universite ? String(universite) : null);
    }
    if (annee_academique !== undefined) {
      updates.push('annee_academique=?');
      params.push(annee_academique ? String(annee_academique) : null);
    }

    if (type_document != null) {
      const td = pickEnum(type_document, allowedTypes);
      if (!td) return res.status(400).json({ message: 'نوع الوثيقة غير صالح' });
      updates.push('type_document=?');
      params.push(td);
    }
    if (niveau != null) {
      const nl = pickEnum(niveau, allowedLevels);
      if (!nl) return res.status(400).json({ message: 'المستوى غير صالح' });
      updates.push('niveau=?');
      params.push(nl);
    }

    if (!updates.length) 
      
      
      
      
      return res.status(400).json({
        
        
        
        
        message: 'لا توجد حقول لتعديلها' });

    params.push(id);
    await db.query(`UPDATE documents SET ${updates.join(', ')} WHERE id=?`, params);
    res.json({ message: 'تم تحديث الوثيقة' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});







// استبدال ملف PDF لوثيقة موجودة
router.put('/:id/file', uploadLimiter, uploadWrapper(uploadPDF.single('file')), 
async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isFinite(id)) {
      if (req.file) safeUnlink(req.file.path);
      return res.status(400).json({ message: 'معرّف الوثيقة غير صالح' });
    }

    if (!req.file) return res.status(400).json({ message: 'ملف PDF مطلوب' });

    const [rows] = await db.query('SELECT id,fichier_path FROM documents WHERE id=? LIMIT 1', [id]);
    if (!rows.length) {
      safeUnlink(req.file.path);
      return res.status(404).json({ message: 'الوثيقة غير موجودة' });
    }

    const oldPath = rows[0].fichier_path;
    const newRelPath = relUploadPath('docs', req.file.filename);

    await db.query(
      'UPDATE documents SET fichier_path=?, fichier_nom=?, taille_fichier=? WHERE id=?',
      [newRelPath, req.file.originalname, req.file.size, id]
    );

    const oldAbs = absFromUploadPath(oldPath);
    if (oldAbs && fs.existsSync(oldAbs)) 
      safeUnlink(oldAbs);

    res.json({ message: 'تم استبدال الملف' });
  } catch (e) {
    if (req.file) safeUnlink(req.file.path);
    res.status(500).json({ message: e.message });
  }
});

// حذف وثيقة + حذف الملف من القرص
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isFinite(id))
       return res.status(400).json({ message: 'معرّف الوثيقة غير صالح' }

    );

    const [rows] = await db.query('SELECT id,fichier_path FROM documents WHERE id=? LIMIT 1', [id]);
    if (!rows.length) 
      return res.status(404).json({ message: 'الوثيقة غير موجودة' });

    const abs = absFromUploadPath(rows[0].fichier_path);
    await db.query('DELETE FROM documents WHERE id=?', [id]);
    if (abs && fs.existsSync(abs)) safeUnlink(abs);

    res.json({ message: 'تم حذف الوثيقة ' });
  } catch (e) 
  {
    res.status(500).json({ message: e.message });
  }
});




router.post(
  '/upload',
  uploadLimiter,
  uploadWrapper(uploadPDF.single('file')),
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

      const fichier_path = relUploadPath('docs', req.file.filename);

      if (!module_id || !titre || !type_document) {
        if (req.file) safeUnlink(req.file.path);
        return res.status(400).json({ message: 'module_id و titre و type_document مطلوبة' });
      }

      const moduleIdInt = parseInt(module_id);
      if (!Number.isFinite(moduleIdInt)) {
        safeUnlink(req.file.path);
        return res.status(400).json({ message: 'module_id غير صالح' });
      }

      if (!(await moduleExists(moduleIdInt))) {
        safeUnlink(req.file.path);
        return res.status(400).json({ message: 'الوحدة غير موجودة' });
      }

      const [r] = await db.query(
        `INSERT INTO documents
        (module_id,titre,description,auteur,universite,annee_academique,
         type_document,niveau,fichier_path,fichier_nom,taille_fichier,uploader_id,approuve)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,NULL,1)`,
        [
          moduleIdInt,
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
        ]
      );

      res.status(201).json({
        id: r.insertId,
        message: 'تم رفع الوثيقة 🎉'
      });

    } catch (e) {
      if (req.file) safeUnlink(req.file.path);
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;