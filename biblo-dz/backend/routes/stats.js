
const express = require('express');

const db = require('../config/db');

const router = express.Router();


router.get('/global', async (req, res) => {

  try
   {

    const [[d]] = await db.query('SELECT COUNT(*) AS c FROM documents WHERE approuve=1');

    const [[l]] = await db.query('SELECT COALESCE(SUM(nb_telechargements),0) AS c FROM documents');

    const [[s]] = await db.query('SELECT COUNT(*) AS c FROM specialites');

    const [[m]] = await db.query('SELECT COUNT(*) AS c FROM modules');

    res.json({ documents:d.c, telechargements:l.c, specialites:s.c, modules:m.c });

  } 
  catch(e)

  { 
    res.status(500)
    .json(
      
      { 

      message:e.message 
    }

  ); }

}
);

router.get('/top-documents', async (req, res) => {

  try {

    const { limit=10 } = req.query;

    const [r] = await db.query(`

      SELECT d.id,d.titre,d.type_document,d.niveau,d.nb_telechargements,d.nb_vues,d.note_moyenne,

        m.nom AS module_nom, s.nom AS specialite_nom,s.slug AS specialite_slug

      FROM documents d JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id

      WHERE d.approuve=1 ORDER BY d.nb_telechargements DESC LIMIT ?

    `, [parseInt(limit)]);

    res.json(r);

  } 
  catch(e)

   {
     res.status(500)
     .json(
      {
      
      message:e.message

      }
    ); 
  
  }
}
);

router.get('/top-specialites', async (req, res) => {
  try
  
  {

    const [r] = await db.query(`

      SELECT s.nom,s.slug,s.couleur,s.icone,COUNT(DISTINCT d.id) AS nb_docs,COALESCE(SUM(d.nb_telechargements),0) AS total_dl

      FROM specialites s LEFT JOIN modules m ON m.specialite_id=s.id LEFT JOIN documents d ON d.module_id=m.id AND d.approuve=1

      GROUP BY s.id ORDER BY total_dl DESC LIMIT 8
    `)
    ;
    res.json(r);

  } 
  catch(e)

   { 
    res.status(500)
    .json({
       message:e.message
       }
      ); 
    }
});

module.exports = router;
