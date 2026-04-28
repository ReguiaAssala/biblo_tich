module.exports = (error, req, res, next) 

=> {


  console.error(error,

     'Error occurred'
    
    );
  res.status(error.status || 500)
  
  .json({

    message: error.message 
    
    || 'Server ErroRRR',

  });



};