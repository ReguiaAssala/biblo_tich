#  biblo  — المكتبة الجامعية



---
![Alternative Text](biblo-dz\frontend\imagesSCreenshots\p1.png)

digital academic library platform  designed to provide thousands of university students with free access to course materials, exercises, examinations, and academic documents across all university specializations. The platform enables students to upload, download, rate, and organize academic PDF documents in a structured, searchable repository
##  خطوات التشغيل



### 1. قاعدة البيانات






```powershell

# في CMD 


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
npm run dev
```

الخادم يعمل على: `http://localhost:5001`
فحص : `http://localhost:5001/api/health`

### 3. Frontend


افتح `frontend/index.html` في المتصفح مباشرة.

أو استخدم Live Server في VS Code:

- انقر بزر الماوس الأيمن على `index.html`

- اختر "Open with Live Server"

---

##  إعداد .env


```env
PORT=5001
DB_HOST=localhost

DB_USER=root

DB_PASSWORD=12345
DB_NAME=bibliotheque_dz
JWT_SECRET=biblio_dz_secret_key_2024_change_me
JWT_EXPIRES_IN=7d

MAX_FILE_SIZE=52428800

NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

---

##                    الـ APIs الرئيسية




| GET | `/api/specialites`                         كل التخصصات    
| GET | `/api/specialites/:slug/modules`                       وحدات تخصص  
| GET | `/api/documents?module_id=&type=`         قائمة وثائق 
| GET | `/api/documents/:id/download`           ل PDF 
| POST | `/api/documents/upload`               رفع PDF 
| GET | `/api/stats/global`                   إحصائيات 
| GET | `/api/search/documents?q=`                  البحث 

---

## التقنيات المستخدمة


**Frontend:**

 HTML5 · CSS3 · bootstrap
  JavaScript Vanilla 
  
  · Font Awesome

**Backend:**

 Node.js · 
 Express.js 
 · MySQL2 · JWT ·
  Multer ·
   bcryptjs
