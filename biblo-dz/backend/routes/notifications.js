// routes/notifications.js
const express = require('express');



const router  = express.Router();


const db = require('../config/db');
const { auth }= require('../middleware/auth');


router.get('/', auth, async (req,res) => {

  try {

    
    const {page=1,limit=20}=req.query;
    const [r]=await db.query('SELECT * FROM notifications WHERE utilisateur_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.user.id,parseInt(limit),(parseInt(page)-1)*parseInt(limit)]);
    res.json(r);
  } catch(e){ res.status(500).json({message:e.message}); }
});
router.get('/count', auth, async (req,res) => {
  try {
    const [[r]]=await db.query('SELECT COUNT(*) AS count FROM notifications WHERE utilisateur_id=? AND lu=0',[req.user.id]);
    res.json({count:r.count});
  } catch(e){ res.status(500).json({message:e.message}); }
});
router.put('/read-all', auth, async (req,res) => {
  try { await db.query('UPDATE notifications SET lu=1 WHERE utilisateur_id=?',[req.user.id]); res.json({message:'تم تحديد الكل كمقروء ✅'}); }
  catch(e){ res.status(500).json({message:e.message}); }
});
router.put('/:id/read', auth, async (req,res) => {
  try { await db.query('UPDATE notifications SET lu=1 WHERE id=? AND utilisateur_id=?',[req.params.id,req.user.id]); res.json({message:'تم'}); }
  catch(e){ res.status(500).json({message:e.message}); }
});
router.delete('/:id', auth, async (req,res) => {
  try { await db.query('DELETE FROM notifications WHERE id=? AND utilisateur_id=?',[req.params.id,req.user.id]); res.json({message:'تم الحذف'}); }
  catch(e){ res.status(500).json({message:e.message}); }
});

module.exports = router;
