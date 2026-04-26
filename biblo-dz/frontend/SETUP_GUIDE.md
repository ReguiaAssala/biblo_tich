# 🚀 دليل تشغيل المشروع — خطوة بخطوة

## ⚠️ المشكلات التي واجهتها وحلولها

| المشكلة | السبب | الحل |
|---------|-------|------|
| `database.sql` غير موجود | لم يكن موجوداً في المشروع | ✅ تم إنشاؤه الآن |
| `Access denied` لـ MySQL | تستخدم `mysql -u root -p` مع كلمة مرور | ✅ استخدم `mysql -u root` بدون `-p` |
| أخطاء `Foreign key` | تشغيل `additions.sql` قبل الجداول الأساسية | ✅ شغّل `database.sql` أولاً فقط |

---

## 📁 ضع الملفات هكذا

```
C:\Users\PC\Downloads\files\biblo-dz\
├── database.sql          ← ← ← انسخ هذا الملف هنا
├── frontend\
│   ├── index.html
│   ├── css\style.css
│   └── js\app.js
└── backend\
    ├── server.js
    ├── .env
    ├── package.json
    ├── additions.sql
    ├── config\
    ├── middleware\
    └── routes\
```

---

## الخطوة 1 — تشغيل قاعدة البيانات

افتح PowerShell في مجلد `biblo-dz` ثم:

```powershell
# الدخول إلى MySQL بدون كلمة مرور
mysql -u root

# داخل MySQL اكتب:
source C:/Users/PC/Downloads/files/biblo-dz/database.sql
```

يجب أن ترى:
```
✅ قاعدة البيانات جاهزة!
specialites_count: 18
modules_count: 53
users_count: 1
```

ثم اخرج:
```sql
exit
```

---

## الخطوة 2 — تشغيل الـ Backend

```powershell
cd C:\Users\PC\Downloads\files\biblo-dz\backend
npm install
npm run dev
```

يجب أن ترى:
```
✅ MySQL متصل بنجاح — bibliotheque_dz
🚀 الخادم يعمل على: http://localhost:5000
```

---

## الخطوة 3 — تشغيل الـ Frontend

في VS Code:
1. انقر بزر الماوس الأيمن على `frontend\index.html`
2. اختر **"Open with Live Server"**

أو افتح مباشرة: `http://127.0.0.1:5500/frontend/index.html`

---

## ✅ اختبار أن كل شيء يعمل

افتح المتصفح على:
- `http://localhost:5000/api/health` → يجب أن يظهر `{"status":"ok"}`
- `http://localhost:5000/api/specialites` → يجب أن يظهر قائمة التخصصات

---

## 🔑 بيانات الدخول الافتراضية

```
البريد:    admin@biblio-dz.com
كلمة المرور: Admin@2024
```

---

## ❓ مشاكل شائعة

**`Cannot connect to MySQL`**
→ تأكد أن XAMPP أو WAMP يعمل

**`EADDRINUSE port 5000`**
→ المنفذ مشغول، غير في `.env` إلى `PORT=5001`

**الموقع يعمل بدون بيانات**
→ الـ Frontend يعمل حتى بدون Backend (يعرض بيانات تجريبية)
