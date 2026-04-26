module.exports = (upload) => (req, res, next) => {
  upload(req, res, 
    
    (errorr) => {

    if (errorr)
      
      
      
      
      return res.status(400).json({
       message:
        err.message
      
      
      });
    next();
  });
};