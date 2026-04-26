// routes/annonces.js
const express = require('express');
const db = require('../config/db');



const { auth } = require('../middleware/auth');

const { isAdmin}= require('../middleware/isAdmin');
const router= express.Router();

router.get('/',     async (req,res) => {


  try { 
    
    const [r]  = await db.query('SELECT * FROM annonces WHERE actif=1 ORDER BY created_at DESC');
    
    
    
    res.json(r); 
  
  
  }

  catch(eror){
    
    
    res.status(500).json({
      
      
      message:eror.message
    
    });
   }
});
router.get('/all',  auth, isAdmin, async (req,res) => {

  try {
     const [r]=await db.query('SELECT * FROM annonces ORDER BY created_at DESC'); 
     res.json(r);
     }
  catch(e){
     res.status(500).json({
      message:e.message
    
    }); 
  }
});

router.get('/:id',  async (req,res) => {

  try { 
    
    const [[r]]=await db.query('SELECT * FROM annonces WHERE id=?',[req.params.id]); 
    
    
    if(!r) return res.status(404).json({
      message:'غير موجود'});
      
      res.json(r); 
    
    }
  catch(e){
    
    res.status(500).json({
      message:e.message
    
    });
  
  }
});

router.post('/',    auth, isAdmin, async (req,res) => {
  try {

    const {titre,contenu,  type}  = req.body;
    if(!titre||!contenu) 
      
      
      return
       res.status(400).json({
        
        message:'  العنوان واضح'});
    const [r]=await db.query('INSERT INTO annonces (titre,contenu,type) VALUES(?,?,?)'
      ,[titre,contenu,type||
        'info']);
    res.status(201).json({
      id:r.insertId,message:'  نششرنا العنوان هنا  '  
    
    
    });


  } catch(e){
    
    res.status(500).json({
      
      message:e.message
    

    });

  
  }
});
router.put('/:id',  auth, isAdmin, async (req,res) => {

  try {
     const {
      
      titre,contenu,type
    }=req.body; 
    
    await db.query('UPDATE annonces SET titre=?,contenu=?,type=? WHERE id=?',
      [titre,contenu,type,req.params.id]); res.json({
        
        
        message:' update  !!!  2'



      });
     }
  catch(eee){
    
    res.status(500).json({
      
      message:eee.message
    
    }); 
  
  
  }
});
router.put('/:id/toggle', auth, isAdmin, async (req,res) => {

  try { 
    
    await db.query('UPDATE annonces SET actif=NOT actif WHERE id=?',[req.params.id]);
    
    res.json({
      message:'we are change this '
    
    }); 
  
  }
  catch(eee){ 
    
    res.status(500).json({
      
      message:eee.message
    
    
    }); 
  
  }
});

router.delete('/:id', auth, isAdmin, async (req,res) => {

  try { 
    await db.query('DELETE FROM annonces WHERE id=?',[req.params.id]); 
    res.json(
      {
      message:' we are deleted this  so '});
  
  
  
  }
  catch(eee){
    
    res.status(500).json({

      message:eee.message
    
    
    }); }
});



module.exports = router;
