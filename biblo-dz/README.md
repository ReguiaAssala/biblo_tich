# 📚 بيبليو DZ — المكتبة الجامعية الجزائرية

## 🗂️ هيكل المشروع

```
biblio-dz/
│
├── frontend/                   ← واجهة المستخدم
│   ├── index.html              ← صفحة HTML الرئيسية
│   ├── css/
│   │   └── style.css           ← كل التنسيقات
│   └── js/
│       └── app.js              ← كل منطق JavaScript
│
└── backend/                    ← الخادم والـ API
    ├── server.js               ← نقطة الدخول
    ├── .env                    ← متغيرات البيئة
    ├── package.json
    ├── additions.sql           ← جداول إضافية
    ├── config/
    │   ├── db.js               ← اتصال MySQL
    │   └── multer.js           ← إعداد رفع الملفات
    ├── middleware/
    │   ├── auth.js             ← التحقق من JWT
    │   ├── isAdmin.js          ← صلاحيات الأدوار
    │   └── rateLimiter.js      ← الحماية من الـ spam
    ├── routes/
    │   ├── auth.js             ← تسجيل الدخول والتسجيل
    │   ├── users.js            ← إدارة المستخدمين
    │   ├── specialites.js      ← التخصصات
    │   ├── modules.js          ← الوحدات
    │   ├── documents.js        ← الوثائق PDF
    │   ├── search.js           ← البحث
    │   ├── favoris.js          ← المفضلة
    │   ├── notes.js            ← التقييمات
    │   ├── stats.js            ← الإحصائيات
    │   ├── annonces.js         ← الإعلانات
    │   ├── commentaires.js     ← التعليقات
    │   ├── notifications.js    ← الإشعارات
    │   └── admin.js            ← لوحة التحكم
    └── uploads/
        ├── docs/               ← ملفات PDF المرفوعة
        └── avatars/            ← صور المستخدمين
```

---

## 🚀 خطوات التشغيل

### 1. قاعدة البيانات

```powershell
# في CMD (ليس PowerShell):
mysql -u root -p < database.sql
mysql -u root -p bibliotheque_dz < additions.sql

# أو في MySQL shell:
source C:/path/to/database.sql
source C:/path/to/additions.sql
```

### 2. Backend

```powershell
cd backend
npm install
# عدّل .env (أضف كلمة مرور MySQL إن وجدت)
npm run dev
```

الخادم يعمل على: `http://localhost:5000`
فحص الصحة: `http://localhost:5000/api/health`

### 3. Frontend

افتح `frontend/index.html` في المتصفح مباشرة.

أو استخدم Live Server في VS Code:
- انقر بزر الماوس الأيمن على `index.html`
- اختر "Open with Live Server"

---

## ⚙️ إعداد .env

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=         ← كلمة مرور MySQL إن وجدت
DB_NAME=bibliotheque_dz
JWT_SECRET=biblio_dz_secret_key_2024_change_me
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=52428800
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🔑 بيانات الدخول الافتراضية

| الدور | البريد | كلمة المرور |
|-------|--------|------------|
| Admin | admin@biblio-dz.com | Admin@2024 |

---

## 📡 قائمة الـ APIs الرئيسية

| Method | Route | الوصف |
|--------|-------|-------|
| POST | `/api/auth/register` | تسجيل حساب |
| POST | `/api/auth/login` | تسجيل دخول |
| GET | `/api/specialites` | كل التخصصات |
| GET | `/api/specialites/:slug/modules` | وحدات تخصص |
| GET | `/api/documents?module_id=&type=` | قائمة وثائق |
| GET | `/api/documents/:id/download` | تحميل PDF |
| POST | `/api/documents/upload` | رفع PDF |
| GET | `/api/stats/global` | إحصائيات |
| GET | `/api/search/documents?q=` | البحث |

---

## 🛠️ التقنيات المستخدمة

**Frontend:** HTML5 · CSS3 · JavaScript Vanilla · Font Awesome

**Backend:** Node.js · Express.js · MySQL2 · JWT · Multer · bcryptjs
