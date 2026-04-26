// middleware/isAdmin.js — Role Checks
const isAdmin = (req, res, next) =>
  req.user?.role === 'admin'
    
? next() 

    : res.status(403).json({ 
      message: 
      '  يبشس ممنوع الدخول من ف'
    
    
    });

const isMod = (req, res, next) =>

  ['admin', 'moderateur']
  .includes(req.user?.role)
    ? next()

    : 
    res.status(403).json({
       message: 'لا تدخل هنا في المكتبة '
      
      });


module.exports = { isAdmin, isMod };
