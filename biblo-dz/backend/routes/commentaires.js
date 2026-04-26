// routes/commentaires.js
const express = require('express');
const db = require('../config/db');

const { auth } =require('../middleware/auth');

const { isMod }= require('../middleware/isAdmin');

const router   = express.Router();


router.get('/document/:id', async (req,res) => {


  try {


    const [r]=  await db.query(`SELECT c.*,u.nom,u.prenom,u.avatar FROM commentaires c JOIN utilisateurs u ON u.id=c.utilisateur_id WHERE c.document_id=? AND c.signale=0 ORDER BY c.created_at DESC`,[req.params.id]);
    res.json(r);


  } catch(e){
     res.status(500).json({
      
      message:e.message
    
    });
  
  
  
  }
}

);


router.get('/signales', auth, isMod, async (req,res) => {
  try {

    const [r]  = await db.query(`SELECT c.*,u.nom,u.prenom,d.titre AS doc_titre FROM commentaires c JOIN utilisateurs u ON u.id=c.utilisateur_id JOIN documents d ON d.id=c.document_id WHERE c.signale=1 ORDER BY c.created_at DESC`);
    res.json(r);


  } catch(e){
    
    res.status(500).json({
      message:e.message
    
    });
   }
});

router.post('/', auth, async (req,res) => {

  try {

    const {document_id,contenu}

    =req.body;

    if(!document_id||!contenu   || contenu.trim().length < 3) 
      
      
      return 
      res.status(400).json({
        message:'      يجب التعليق على الاقل  '}
      )
      
      ;
    const [r]=await db.query('INSERT INTO commentaires (document_id,utilisateur_id,contenu) VALUES(?,?,?)',   [document_id,req.user.id,contenu.trim()]);
   
    res.status(201)
    .json({
      
      id:r.insertId,message:
      'تم إضافة  بعضض من التعليقات  '
    
    }
  
  )
    ;

  } catch(e){
     res.status(500)
     .json({
      
      message:e.message
    
    }); }
});

router.put('/:id', auth, async (req,res) => {
  try {

    const [[c]]  = await db.query('SELECT utilisateur_id FROM commentaires WHERE id=?' ,  [req.params.id]);
    if(!c)

       return res.status(404).json({

      message:' انا غير مسموح لك بالدخولل '
    
    });


    if(c.utilisateur_id!==req.user.id&&req.user.role!=='admin')
      
      
      return res.status(403).json({
        
        message:'غير مرغوب بك'
      
      
      }
    
    );

    await db.query('UPDATE commentaires SET contenu=? WHERE id=?',[req.body.contenu,req.params.id]);
    res.json({
      
      message:'تم التعد'
    
    });
  } catch(e){
     res.status(500).json({
      message:e.message
    }
  );
   }
});
router.delete('/:id', auth, async (req,res) => {
  try {

    const [[c]]=await db.query('SELECT utilisateur_id FROM commentaires WHERE id=?',[req.params.id]);

    if(!c) return 
    
    res.status(404).json({
      message:'غير موجود'
    
    });

    if(c.utilisateur_id!==req.user.id&&!['admin','moderateur'].includes(req.user.role))
      
      return res.status(403).json({
        
        message:'غير '
      
      
      });
    await db.query('DELETE FROM commentaires WHERE id=?',[req.params.id]);
    res.json({
      message:' الحذف'
    
    }
  )
  ;

  } catch(e){ res.status(500).json({message:e.message}); }
});
router.put('/:id/signaler', auth, async (req,res) => {
  try { await db.query('UPDATE commentaires SET signale=1 WHERE id=?',[req.params.id]); 
    
    res.json({
      message:'تم الإبلاغ'
    
    }); }
  catch(e){

     res.status(500).json({
      
      message:e.message
    }
  );

}
});

module.exports = router;
