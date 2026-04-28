// routes/annonces.js
const express = require('express');

const db = require('../config/db');

const router= express.Router();


router.get('/', async (req,res) => {


  try 
  
  
  { 
    

    const [r]  = await db.query('SELECT * FROM annonces WHERE actif=1 ORDER BY created_at DESC');
    
    
    
    res.json(r);

  
  
  }

  catch(eror){
    
    
    res.status(500).json({
      
      

      message:eror.message
    
    }
  )
  ;
   }
});

router.get('/:id',  async (req,res) => {


  try { 
    
    const [[r]]=await db.query('SELECT * FROM annonces WHERE id=?',[req.params.id]); 

    
    
    if(!r) return res.status(404).json({

      message:' ads not found'});

      
      res.json(r); 
    
    }
  catch(e){
    
    res.status(500).json(
      
      {

      message:e.message
      
    
    });
  
  }
});




module.exports = router;
