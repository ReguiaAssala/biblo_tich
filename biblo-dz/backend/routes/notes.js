// routes/notes.js
const express = require('express');
const db      = require('../config/db');
const { auth }= require('../middleware/auth');
const router  = express.Router();

router.get('/document/:id', async (req, res) => {
  try {
    const [r] = await db.query(`SELECT n.*,u.nom,u.prenom,u.avatar FROM notes_documents n JOIN utilisateurs u ON u.id=n.utilisateur_id WHERE n.document_id=? ORDER BY n.created_at DESC`, [req.params.id]);
    res.json(r);
  } catch(e) { res.status(500).json({ message:e.message }); }
});

router.get('/my-rating/:docId', auth, async (req, res) => {
  try {
    const [[r]] = await db.query('SELECT * FROM notes_documents WHERE utilisateur_id=? AND document_id=?', [req.user.id, req.params.docId]);
    res.json(r||null);
  } catch(e) { res.status(500).json({ message:e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { document_id, note, commentaire } = req.body;
    if (!document_id || !note || note<1 || note>5) return res.status(400).json({ message:'التقييم بين 1 و 5' });
    await db.query('INSERT INTO notes_documents (document_id,utilisateur_id,note,commentaire) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE note=VALUES(note),commentaire=VALUES(commentaire)',
      [document_id, req.user.id, note, commentaire||null]);
    await db.query('UPDATE documents SET note_moyenne=(SELECT ROUND(AVG(n.note),2) FROM notes_documents n WHERE n.document_id=documents.id),nb_notes=(SELECT COUNT(*) FROM notes_documents n WHERE n.document_id=documents.id) WHERE id=?', [document_id]);
    res.json({ message:'شكراً على تقييمك ⭐' });
  } catch(e) { res.status(500).json({ message:e.message }); }
});

router.delete('/:docId', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM notes_documents WHERE utilisateur_id=? AND document_id=?', [req.user.id, req.params.docId]);
    await db.query('UPDATE documents SET note_moyenne=COALESCE((SELECT ROUND(AVG(n.note),2) FROM notes_documents n WHERE n.document_id=documents.id),0),nb_notes=(SELECT COUNT(*) FROM notes_documents n WHERE n.document_id=documents.id) WHERE id=?', [req.params.docId]);
    res.json({ message:'تم حذف تقييمك' });
  } catch(e) { res.status(500).json({ message:e.message }); }
});

module.exports = router;
