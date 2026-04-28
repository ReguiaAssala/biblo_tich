



// the middlewre here dfdfs for check at all role
const isAdmin = (req, res, next) =>
  

  req.user?.role === 'admin'

    ? next()

    : res.status(403).json(
      { message: '   no '


       }
      
      );

const isMod = (req, res, next) =>

  ['admin', 'moderateur']

  .includes(req.user?.role)
    ? 

    next()

    : 
    res.status(403)
    
    .json({

       message:'Not Founde ' 
      
      }
    );

module.exports = { isAdmin, isMod };
