// routes/favoris.js
const express = require('express');

const db= require('../config/db');


const { auth }= require('../middleware/auth');

const router= express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [r] = await db.query(`SELECT d.*,m.nom AS module_nom,s.nom AS specialite_nom,s.slug AS specialite_slug,s.couleur AS specialite_couleur,f.created_at AS fav_date FROM favoris f JOIN documents d ON d.id=f.document_id JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id WHERE f.utilisateur_id=? ORDER BY f.created_at DESC`, [req.user.id]);
    res.json(r);
    
  } catch(e) { 
    res.status(500).json({

      
      message:e.message 
    });
  
  
  }
});

router.get('/check/:docId', auth, async (req, res) => {
  try {

    const [[r]] = await db.query('SELECT id FROM favoris WHERE utilisateur_id=? AND document_id=?',
       [req.user.id, req.params.docId]);

    res.json({ 
      isFavorite: !!r 
    
    })
    ;
  }
  
  catch(e) 
  {
     res.status(500).json({ 
      message:e.message
     });
     }
});

router.post('/:docId', auth, async (req, res) => {

  try {


    await db.query('INSERT IGNORE INTO favoris (utilisateur_id,document_id) VALUES(?,?)', [req.user.id, req.params.docId]);
    res.json({

      message:'تمت  ', isFavorite: true 
    });

  } 
  catch(e) { 

    res.status(500).json({
      message:e.message 
    
    
    });
   }
});

router.delete('/:docId', auth, async (req, res) => {

  try {

    await db.query('DELETE FROM favoris WHERE utilisateur_id=? AND document_id=?', 
      [req.user.id, req.params.docId]);

    res.json({
      
      message:'تم الحذف  ', 
      isFavorite: false 

    });

  } catch(e) {
     res.status(500).json({
       message:e.message 
      })
      ; 
    }
}
);

module.exports = router;
