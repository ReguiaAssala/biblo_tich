module.exports = (upload) => (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      const code = err.code || err.errno;

      if (code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'الملف كبير جداً (50MB max)' });
      }

      if (code === 'ENOSPC' || /ENOSPC/i.test(String(err.message || ''))) {
        return res.status(507).json({
          message: 'لا توجد مساحة كافية على القرص لحفظ الملف. احذف ملفات قديمة أو غيّر UPLOADS_DIR في .env.',
        });
      }

      return res.status(400).json({ message: err.message || 'فشل رفع الملف' });
    }

    next();
  });
};
