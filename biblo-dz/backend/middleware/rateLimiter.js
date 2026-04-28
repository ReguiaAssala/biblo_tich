// middleware/rateLimiter.js — Anti-Spam
const rateLimit = require('express-rate-limit');


const globalLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 300,


  message: 

  {

     message: '    a lot Prosses to get data ' 
     
    },
});

const authLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 20,

  message: {

     message: ' try agin another '
    
    },
});

const uploadLimiter = rateLimit({

  windowMs: 60 * 60 * 1000,

  max: 10,

  message: {

     message: 'محاولات رفع كثيرة، حاول لاحقاً'

     },

});


module.exports = {

   globalLimiter, authLimiter, uploadLimiter
  
  };
