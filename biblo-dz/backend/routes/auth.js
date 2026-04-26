// middleware/auth.js — JWT Verification
// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {


//   const h = req.headers.authorization;

//   if (!h || !h.startsWith('Bearer
//  '))
//     return res.status(401).json({ message: '  no enter here
// ' });
//   try {
//     req.user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
//     next();
//   } catch(e) {
//     return res.status(401).json({
//  message: 'ة إعادة  الدخول' 
// });
//   }
// };

// // Optional: doesn't block if no token
// const authOpt = (req, res, next) => {
//   const h = req.headers.authorization;
//   if (h?.startsWith('Bearer ')) {

//     try {
//  req.user = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
//  }
//  catch(_) {}
//   }
//   next();
// };

// module.exports = { auth, authOpt };
const express = require('express');


const router = express.Router();


// tesst
router.get('/', (req, res) => {

  res.json({
     message: "Auth route is turn yep " 
    }
  );
}
);


module.exports = router;