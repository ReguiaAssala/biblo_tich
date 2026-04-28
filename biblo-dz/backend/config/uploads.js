const path = require('path');
const fs = require('fs');

const uploadsRoot = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, '..', 'uploads');

const docsDir = path.join(uploadsRoot, 'docs');
const avatarsDir = path.join(uploadsRoot, 'avatars');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function ensureUploadsDirs() {
  ensureDir(uploadsRoot);
  ensureDir(docsDir);
  ensureDir(avatarsDir);
}

function relUploadPath(kind, filename) {
  return ('uploads/' + kind + '/' + filename).replace(/\\/g, '/');
}

function absFromUploadPath(uploadPath) {
  if (!uploadPath) return '';
  const rel = String(uploadPath)
    .replace(/^\\+|^\/+/, '')
    .replace(/\\/g, '/');
  if (!rel) return '';

  if (rel.startsWith('uploads/')) {
    return path.join(uploadsRoot, rel.slice('uploads/'.length));
  }

  // Legacy/defensive: if stored as 'docs/x.pdf' etc.
  return path.join(uploadsRoot, rel);
}

module.exports = {
  uploadsRoot,
  docsDir,
  avatarsDir,
  ensureUploadsDirs,
  relUploadPath,
  absFromUploadPath,
};
