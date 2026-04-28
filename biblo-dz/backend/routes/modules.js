// routes/modules.js
const express = require('express');

const db = require('../config/db');
const router= express.Router();

router.get('/', async (req, res) => {



  try {

    const {
       specialite_id, niveau, search, page=1, limit= 10
       } = 
       req.query;

    let sql=`SELECT m.*,s.nom AS specialite_nom,s.slug AS specialite_slug,COUNT(d.id) AS nb_documents FROM modules m JOIN specialites s ON s.id=m.specialite_id LEFT JOIN documents d ON d.module_id=m.id AND d.approuve=1 WHERE 1=1`;
    const p=[];

    if (specialite_id){ 
      sql+=' AND m.specialite_id=?'; 

      p.push(specialite_id);
    
    }
    if (niveau)      
        { sql+=' AND m.niveau=?'; 
                 p.push(niveau); }
    if (search)    
          {
             sql+=' AND m.nom LIKE ?'; 

                  p.push(`%${search}%`);
                
                }
    sql+=' GROUP BY m.id ORDER BY FIELD(m.niveau,"L1","L2","L3","M1","M2","Doctorat"),m.nom LIMIT ? OFFSET ?';
    p.push(parseInt(limit),(parseInt(page)-1)*parseInt(limit));

    const [r] = await db.query(sql, p);

    res.json(r);

  }
  
  catch(e) { 

    res.status(500).json({
       message:e.message 
      }); 
    }
});

router.get('/:id', async (req, res) => {
  try {

    const [r] = await db.query(`SELECT m.*,s.nom AS specialite_nom,s.slug AS specialite_slug,COUNT(d.id) AS nb_documents FROM modules m JOIN specialites s ON s.id=m.specialite_id LEFT JOIN documents d ON d.module_id=m.id AND d.approuve=1 WHERE m.id=? GROUP BY m.id`, [req.params.id]);
    if (!r.length)
       return res.status(404).json({ 

      message:' موجودة'

     }
    )
    ;

    res.json(r[0]);

  } catch(e) { 
    res.status(500).json({

       message:e.message
       }
      );
       }
});

router.get('/:id/documents', async (req, res) => {
  try {

    const {
       type, sort='recent', page=1, limit=12
       } =
        req.query;

    const sm = {
       popular:'d.nb_telechargements DESC', noted:'d.note_moyenne DESC', recent:'d.created_at DESC' 
      };

    let sql=`SELECT d.* FROM documents d WHERE d.module_id=? AND d.approuve=1`;
    const p=[req.params.id];

    if (type){
       sql+=' AND d.type_document=?';

       p.push(type);
      
      }
    sql+=` ORDER BY ${sm[sort]||'d.created_at DESC'} LIMIT ? OFFSET ?`;

    p.push(parseInt(limit),(parseInt(page)-1)*parseInt(limit));

    const [r] = await db.query(sql, p);

    res.json(r);

  } catch(e) {
     res.status(500).json({

       message:e.message 

      });
    
    }
});

module.exports = router;
