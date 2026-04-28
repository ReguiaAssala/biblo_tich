// routes/specialites.js
const express    = require('express');
const db         = require('../config/db');
const router     = express.Router();


router.get('/', async (req, res) => {
  try 
  
  {

    const [rows] = await db.query(`

      SELECT s.*,
        COUNT(DISTINCT m.id) AS nb_modules,
        COUNT(DISTINCT d.id) AS nb_documents,
        COALESCE(SUM(d.nb_telechargements),0) AS total_telechargements
      FROM specialites s
      LEFT JOIN modules m ON m.specialite_id=s.id
      LEFT JOIN documents d ON d.module_id=m.id AND d.approuve=1
      GROUP BY s.id ORDER BY s.nom
    `);
    res.json(rows);

  } 
  
  catch(e)

   { 
    res.status(500)
    .json(
      {
      
      message: e.message
     }
    ); }
});

router.get('/:slug', async (req, res) => 
  {

  try 
  {

    const [rows] = await db.query(`

      SELECT s.*, COUNT(DISTINCT m.id) AS nb_modules, COUNT(DISTINCT d.id) AS nb_documents

      FROM specialites s

      LEFT JOIN modules m ON m.specialite_id=s.id

      LEFT JOIN documents d ON d.module_id=m.id AND d.approuve=1

      WHERE s.slug=? GROUP BY s.id

    `,
     [req.params.slug]);

    if (!rows.length) 

      return

       res.status(404)
       .json(
        
        
        {
         message: 'التخصص غير موجود' 
        
        }
      );

    res.json(rows[0]);

  } catch(e) {
     res.status(500)
     .json(
      {
       message: e.message
      
      }
    ); }
});



router.get('/:slug/modules', async (req, res) => {
  try
  
  {

    const { niveau } = req.query;
    let sql = `

      SELECT m.*, COUNT(d.id) AS nb_documents

      FROM modules m
      JOIN specialites s ON s.id=m.specialite_id
      LEFT JOIN documents d ON d.module_id=m.id AND d.approuve=1
      WHERE s.slug=?
      `;
    const params = [req.params.slug];

    if (niveau)
       {

       sql += ' AND m.niveau=?';
       params.push(niveau);


     }

    sql += ' GROUP BY m.id ORDER BY FIELD(m.niveau,"L1","L2","L3","M1","M2","Doctorat"), m.nom';
    const [rows] = await db.query(sql, params);

    res.json(rows);

  } 
  catch(e)
   {
     res.status(500)
     .json(
      {
       message: e.message
       }
      );
     }
});



router.get('/:slug/stats', async (req, res) => {
  try
   {


    const [[row]] = await db.query(`

      SELECT COUNT(DISTINCT m.id) AS nb_modules, COUNT(DISTINCT d.id) AS nb_documents,
        COALESCE(SUM(d.nb_telechargements),0) AS total_dl,

        ROUND(AVG(d.note_moyenne),2) AS note_moy

      FROM specialites s
      LEFT JOIN modules m ON m.specialite_id=s.id
      LEFT JOIN documents d ON d.module_id=m.id AND d.approuve=1
      WHERE s.slug=?

    `, [req.params.slug]);
    


    res.json(row);
    
  } catch(e)
   {
     res.status(500)
     .json(
    
      { 
      message: e.message 
    }
  ); }
});

module.exports = router;
