/**
 * routes/auth.js — Authentication Routes
 * NOTE: Login/Register removed from frontend as requested
 */


const express = require('express');


const bcryptjs = require('bcryptjs');


const jwt = require('jsonwebtoken');


const db = require('../config/db');


const { auth } = require('../middleware/auth');

const router = express.Router();



// Health check
router.get('/', (req, res) => {

  res.json({ message: 'Auth API  is running' });

});

// Get current user yeahh
router.get('/me', auth, async (req, res) => {
  try {

    const [r] = await db.query(

      'SELECT id, nom, prenom, email, role, universite FROM utilisateurs WHERE id = ?',

      [req.user.id]

    );


    if (!r.length) 

      
      return res.status(404).json(

        { 
          message: 'user not found '
        
        
        }

      
      );


    res.json(r[0]);
  } catch (e) {

    res.status(500).json(
      {

       message: e.message
        
      });
  }
});

module.exports = router;