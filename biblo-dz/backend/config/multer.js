const multer = require('multer');
const path = require('path');
const { docsDir, avatarsDir, ensureUploadsDirs } = require('./uploads');

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDirs();
    cb(null, docsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const pdfFilter = (req, file, cb) => {

  const ext = (path.extname(file.originalname || '') || '').toLowerCase();
  const mt = String(file.mimetype || '').toLowerCase();

  const isPdfMime =

    mt === 'application/pdf' ||

    mt === 'application/x-pdf' ||

    mt === 'application/acrobat' ||

    mt === 'applications/vnd.pdf' ||

    mt === 'text/pdf' ||
    
    mt === 'application/octet-stream';

  //                                بعض المتصفحات/الأجهزة ترسل mimetype غير دقيق؛ نسمح فقط إذا الامتداد PDF.
  if (ext === '.pdf' && isPdfMime) return cb(null, true);
  if (ext === '.pdf') 
    return 
  
  cb(null, true);

  return cb(new Error('يُسمح بملفات PDF فقط'), false);
};

const uploadPDF = multer({


  storage: pdfStorage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 },
  fileFilter: pdfFilter,
}
);


const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDirs();

    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + req.user.id + '-' + Date.now() + path.extname(file.originalname));
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('صور فقط')),
});

module.exports = { uploadPDF, uploadAvatar };