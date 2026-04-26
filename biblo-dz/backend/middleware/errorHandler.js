module.exports = (error, req, res, next) => {
 
  console.error(error , "errror you nust fix it ");


  res.status(error.status || 500)
  .json({

    message: error.message 
    || "Server Error",
  });
};