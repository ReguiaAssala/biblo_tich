
const express = require('express');
const db  = require('../config/db');
const { auth } = require('../middleware/auth');
const { isAdmin, isMod } = require('../middleware/isAdmin');
const router 
= express.Router();

router.use(auth); 


router.get('/dashboard', isAdmin, async (req, res) => {
  try 
  
  {

    const [[docs]] = await db.query('SELECT COUNT(*) AS c FROM documents WHERE approuve=1');

    const [[pending]] = await db.query('SELECT COUNT(*) AS c FROM documents WHERE approuve=0');


    const [[users]]= await db.query('SELECT COUNT(*) AS c FROM utilisateurs');


    const [[dl]] = await db.query('SELECT COALESCE(SUM(nb_telechargements),0) AS c FROM documents');

    const [[td]] = await db.query('SELECT COUNT(*) AS c FROM telechargements WHERE DATE(created_at)=CURDATE()');

    const [[tr]] = await db.query('SELECT COUNT(*) AS c FROM utilisateurs WHERE DATE(created_at)=CURDATE()');

    const [top] = await db.query(`SELECT d.id,d.titre,d.nb_telechargements,d.nb_vues,s.nom AS specialite_nom FROM documents d JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id WHERE d.approuve=1 ORDER BY d.nb_telechargements DESC LIMIT 5`);
    const [recent]  = await db.query('SELECT id,nom,prenom,email,role,created_at FROM utilisateurs ORDER BY created_at DESC LIMIT 5');

    res.json(
      
      {

      stats: {
         documents:docs.c, 

         pending:pending.c,

          utilisateurs:users.c,

           telechargements:dl.c,

            today_dl:td.c,

             today_reg:tr.c 
            
            },
      top_docs:
       top,

        recent_users: 

        recent,
    }
  
  );


  } 
  
  
  catch(ee) {

     res.status(500).
     json({ 
      message:ee.message
    
    }); }
});



// forr all useresss heree sos i yeas





router.get('/users', isMod, async (req, res) => {

  try { 

    const { 

      search, 
      role, page=1, 
      limit=20
     } = 
     req.query;

    let sql='SELECT id,nom,prenom,email,role,universite,wilaya,actif,created_at FROM utilisateurs WHERE 1=1';
   
    const p=[];



    if (search)
      
      {

       sql+=' AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)';

        const q=`%${search}%`;
        
        p.push(q,q,q); 
      
      }
    if (role)  {

       sql+=' AND role=?';

       
       p.push(role); 
      
      }
    sql+=
    ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    p.push(parseInt(limit)

    ,(

      parseInt(page)-1)*parseInt(limit)
    );

    const [r] = await db.query(sql, p);


    res.json(r);


  } catch(ee) {
    
    res.status(500).json({

       message:ee.message
      
      }); 
    
    }
});



//doucement

router.get('/documents', isMod, 
  async (req, res) => {

  try {

    const {
       approuve, page=1, limit=20 
      } 
      = req.query;


    let sql=`SELECT d.id,d.titre,d.type_document,d.niveau,d.approuve,d.featured,d.nb_telechargements,d.nb_vues,d.created_at,m.nom AS module_nom,s.nom AS specialite_nom,u.nom AS uploader_nom,u.prenom AS uploader_prenom FROM documents d JOIN modules m ON m.id=d.module_id JOIN specialites s ON s.id=m.specialite_id LEFT JOIN utilisateurs u ON u.id=d.uploader_id WHERE 1=1`;
    const p=[];


    if (approuve  !== undefined)
      
      { 
        
        
        sql+=' AND d.approuve=?';
         p.push(parseInt(approuve)); 
        
        }
    sql+=' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';

    p.push(parseInt(limit),(parseInt(page)-1)*parseInt(limit));

    const [re] = await db.query(sql, p);


    res.json(re);


  } catch(eee) {
    
    
    res.status(500).json(
      
      {

       message:eee.message
      
      }); }
});




//logenn
router.get('/logs', isAdmin,

  async (req, res) => {

  try {
    const [r] = await db.query(`SELECT t.id,t.ip_address,t.created_at,d.titre AS doc_titre FROM telechargements t JOIN documents d ON d.id=t.document_id ORDER BY t.created_at DESC LIMIT 100`);
    res.json(r);
    

  } catch(e) { 
    res.status(500).json({
       message:e.message });
      
      }
});






module.exports = router;
