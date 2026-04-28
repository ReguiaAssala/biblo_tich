/**
 * server.js — المكتبة الجامعية الجزائرية
 */
require('dotenv').config();

const express = require('express');
const cors= require('cors');

const helmet = require('helmet');


const morgan = require('morgan');


const path = require('path');
const { uploadsRoot, ensureUploadsDirs } = require('./config/uploads');



const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || '*';

const IS_DEV = (process.env.NODE_ENV || 'development') !== 'production';

//  Middleware  yep here routs to likns 
app.use(
  helmet(
    
    {
    crossOriginResourcePolicy: false,

    contentSecurityPolicy: {
      directives: {

        defaultSrc: ["'self'"],

        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],

        imgSrc: ["'self'", 'data:'],

        objectSrc: ["'none'"],

        scriptSrc: ["'self'"],

        scriptSrcAttr: ["'unsafe-inline'"],

        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],

        upgradeInsecureRequests: [],
      },
    },
  })
);
app.use(
  cors(
    
    {
    origin(origin, callback) {


      if (!origin) return callback(null, true);
      if (IS_DEV || FRONTEND_URL === '*') return callback(null, true);

      return callback(null, origin === FRONTEND_URL);

    },

    credentials: true,
  })
);


app.use(express.json(
  { limit: '10mb' }
)
);
app.use(express.urlencoded(
  {
     extended: true
  }
    )
  );
app.use(morgan('dev'));




//  Static uploads to pdf filess so u hope u iks

ensureUploadsDirs();

app.use('/uploads', express.static(uploadsRoot));

//  Routes 




app.use('/api/specialites', require('./routes/specialites'));

app.use('/api/modules', require('./routes/modules'));

app.use('/api/documents', require('./routes/documents'));

app.use('/api/search', require('./routes/search'));

app.use('/api/stats', require('./routes/stats'));

app.use('/api/annonces', require('./routes/annonces'));



//  Health check 

app.get('/api/health', (req, res) => {

  res.json(

    { 
      status: 'ok', message: ' api is workiing successfulle  ', timestamp: new Date() });
}
);

// Serve frontend files 
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

console.log('Frontend path:', frontendPath);

// Root route  serves 
app.get('/', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  console.log(' Serving index.html from:', indexPath);
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(' Error serving index.html:', err.message);
      res.status(500).json({ 
        error: 'Failed to load homepage',
        path: indexPath,
        message: err.message 
      });
    }
  });
});


app.use((req, res) =>
  res.status(404).json(
    { message: 'المسار غير موجود'
    }
  ));





app.use((err, req, res, next) => {


  console.error('Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') 
    return res.status(400).json(
    { 
      message: 'حجم الملف كبير جداً (الحد الأقصى 50MB)'
    }
  );
  if (err.code === 'ENOSPC' || /ENOSPC/i.test(String(err.message || ''))) 
    {
    return res.status(507).json(
      {
        message: 'المساحة التخزينية غير كافية. تحقق من   .'
      }
    );
  }
  res.status(err.status || 500).json(
    { 
      message: err.message || 'خطأ في الخادم'
    }
  );
});

//  Start with DB check 
async function start() {

  try 
  {

    const db = require('./config/db');

    await db.query('SELECT 1');

    console.log(' MySQL connected successfully —', process.env.DB_NAME);
  } 
  catch (err)
  
  {

    console.error(' Failed to connect to MySQL:', err.message);
    console.error('Please check your database connection settings in .env file');
    process.exit(1);
  }

  const server = app.listen(PORT, () => {

    console.log('Server runningggg: http://localhost:' + PORT);
    console.log('Health check: http://localhost:' + PORT + '/api/health');
  });


  server.on('error', (err) => {

    if (err.code === 'EADDRINUSE') {

      console.error(` Port ${PORT} is already in use. Change PORT in .env file`);

      process.exit(1);
    }
    throw err;
  });
}

start();