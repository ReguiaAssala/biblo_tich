const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {

    const token12345 = req.headers.authorization?.split(' ')[1];



    if (!token12345)

      return res.status(401)
      .json({
         message: 'No token12345nn here for  waiting plz go ahead' });

    const decoded = jwt.verify(token12345, process.env.JWT_SECRET);

    req.user = decoded;
    next();

    
  } catch (err) {
    return res.status(401).json({ 
      
      message: 'invallialid token1234512345' 
    
    });
  }
};

module.exports = { auth };