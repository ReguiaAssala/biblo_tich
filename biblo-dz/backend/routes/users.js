
const express = require('express');

const path   = require('path');
const fs = require('fs');


const db = require('../config/db');

const { auth }   = require('../middleware/auth');


const { isAdmin} = require('../middleware/isAdmin');

const { uploadAvatar } = require('../config/multer');

const router     = express.Router();

router.get('/profile', auth, async (req, res) => {

  try {

    const [r] = await db.query('SELECT id,nom,prenom,email,role,universite,wilaya,specialite_id,annee_etude,avatar,created_at FROM utilisateurs WHERE id=?', [req.user.id]);
 if 
 
    (!r.length) 

      return res.status(404).json(
        
        { message:'غير موجود' 

        }
      );

    res.json(r[0]);

  }
   catch(e)
   {
     res.status(500).json(
      { message:e.message 

      }
    ); }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { nom, prenom, universite, wilaya, annee_etude } 
    = req.body;
    await db.query('UPDATE utilisateurs SET nom=?,prenom=?,universite=?,wilaya=?,annee_etude=? WHERE id=?',
      [nom, prenom, universite||null, wilaya||null, annee_etude||null, req.user.id]);
    res.json(
      
      { 
      message:'تم التحديث ' 
    }
  );

  }
   catch(e) 
  { res.status(500).json(
    { 
      message:e.message 

    }); }
});

router.put('/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) 
      return 
    res.status(400).json(
      { 
        message:'صورة مطلوبة' 
      }
    );
    const [r] = await db.query('SELECT avatar FROM utilisateurs WHERE id=?', [req.user.id]);
    if (r[0]?.avatar) 
      { const op = path.join(__dirname,'../',r[0].avatar);
        
        if(fs.existsSync(op)) 
          fs.unlinkSync(op);
        
      }
    const ap = `/uploads/avatars/${req.file.filename}`;
    await db.query('UPDATE utilisateurs SET avatar=? WHERE id=?', [ap, req.user.id]);
    res.json(
      {
        
        message:'تم التحديث ', avatar:ap 
      }
    );

  }
   catch(e)
   {
     res.status(500).json(
      {
         message:e.message
         }
        ); 
      }
});

router.get('/my-uploads', auth, async (req, res) => {
  try {
    const [r] = await db.query(`SELECT d.*,m.nom AS module_nom,s.nom AS specialite_nom,s.slug AS specialite_slug FROM documents d JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id WHERE d.uploader_id=? ORDER BY d.created_at DESC`, [req.user.id]);
    res.json(r);
  } catch(e) { res.status(500).json({ message:e.message }); }
});

router.get('/my-downloads', auth, async (req, res) => {
  try {
    const [r] = await db.query(`SELECT d.*,m.nom AS module_nom,s.nom AS specialite_nom,t.created_at AS dl_date FROM telechargements t JOIN documents d ON d.id=t.document_id JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id WHERE t.utilisateur_id=? ORDER BY t.created_at DESC LIMIT 50`, [req.user.id]);
    res.json(r);
  } catch(e) { res.status(500).json({ message:e.message }); }
});

router.get('/stats', auth, async (req, res) => {
  try
   {
    const [[up]] = await db.query('SELECT COUNT(*) AS c FROM documents WHERE uploader_id=?', [req.user.id]);
    const [[dl]] = await db.query('SELECT COUNT(*) AS c FROM telechargements WHERE utilisateur_id=?', [req.user.id]);
    const [[fv]] = await db.query('SELECT COUNT(*) AS c FROM favoris WHERE utilisateur_id=?', [req.user.id]);
    const [[nt]] = await db.query('SELECT COUNT(*) AS c FROM notes_documents WHERE utilisateur_id=?', [req.user.id]);
    res.json(
      
      {
         uploads:up.c, downloads:dl.c, favorites:fv.c, ratings:nt.c 
        }
      )
        ;
  }
  
  catch(e)
  { 
    res.status(500).json(
      { 
        message:e.message 
      }
    )
    ;
   }
});

// 
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const { search, role, page=1, limit=20 } 
    = req.query;
    let sql='SELECT id,nom,prenom,email,role,universite,wilaya,actif,created_at FROM utilisateurs WHERE 1=1';
    const p=[];
    if (search)
      { 
        sql+=' AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)'; 
        const q=`%${search}%`; p.push(q,q,q); 
      }
    if (role) 
       { 
        sql+=' AND role=?';
         p.push(role);
        
        }
    sql+=' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    p.push(parseInt(limit),(parseInt(page)-1)*parseInt(limit));

    const [r] = await db.query(sql, p);
    res.json(r);

  } 
  
  catch(e)
   { 
    res.status(500).json(
      {
         message:e.message 
        }
      ); 
    }
});

router.put('/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if
     (!['etudiant','moderateur','admin'].includes(role)) 
     
     return 
     res.status(400).json({
       message:'دور غير صالح' 
      }
    );
    await db.query('UPDATE utilisateurs SET role=? WHERE id=?', [role, req.params.id]);
    res.json(
      {
       message:'تم التغيير '
       }
      );
  }
   catch(e)
    {
       res.status(500).json(
        { message:e.message 

        }); }
});

router.put('/:id/actif', auth, isAdmin, async (req, res) => {
  try
   {
    await db.query('UPDATE utilisateurs SET actif=? WHERE id=?', [req.body.actif?1:0, req.params.id]);
    res.json(
      {
       message:'تم التحديث' 
      });
  } catch(e) { res.status(500).json(
    { 
      message:e.message 
    }
  );
 }
});
module.exports = router;
