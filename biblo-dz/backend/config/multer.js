
const multer= require('multer');
const path = require('path');

const fs = require('fs');


const pdfStorage = multer.diskStorage({

  destination: (req, file, cb) => {

    const dir = path.join(__dirname, '../uploads/docs');
    if (!fs.existsSync(dir)) 

      fs.mkdirSync(dir,

     { recursive: true

      });
    cb(null, dir);
  },
  filename: (req, file, cb) => {

    const unique = Date.now() + '-' +
     Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('يُسمح بملفات PDF فقط'), false);
};

const uploadPDF = multer({
  storage:pdfStorage,
  limits:  
  
  { fileSize: parseInt( 
    process.env.MAX_FILE_SIZE) 
    || 52428800 
  
  },
  fileFilter: 

  pdfFilter,

});

const avatarStorage =
multer.diskStorage({
  destination: (req, file, 
    cb) => {
    const dir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(dir)) 
      
      fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);

  },

  filename: (req, file, cb) => {
    cb(null, 'avatar-' + 
      req.user.id + '-' + Date.now() 
      + path.extname(file.originalname));
  },
});

const uploadAvatar= multer({
  storage:    
  avatarStorage,
  limits:    
   { fileSize: 2 * 1024 * 1024 },
  fileFilter:
   (req, file, cb) =>
    file.mimetype.startsWith('image/') 
   ? cb(null, true) 
   : cb(new Error('صور فقط')),
});

module.exports = { 
  uploadPDF,
  
  uploadAvatar };