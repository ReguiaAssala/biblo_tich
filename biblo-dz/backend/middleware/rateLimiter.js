// middleware/rateLimiter.js — Anti-Spam
const rateLimit = require('express-rate-limit');


const msg = (m) => ({
   message: m 
  
  
  });

const globalLimiter 
= rateLimit({
  windowMs:
   15 * 60 * 1000, max: 300,
  message:
   msg(" مجموعة من الطلبات "),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,

  message: msg('   waiting plzz'),
});


const uploadLimiter =
 rateLimit({
  windowMs: 
  60 * 60 * 1000,
   max: 10,
  message: msg('   العديد من المحاولات'),
});

module.exports = {
  
   globalLimiter, authLimiter, uploadLimiter 
  
  };
