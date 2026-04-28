const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
                try
  
  
  
  {
    const token = req.headers.authorization?.split(' ')[1];

for (let index = 0; index < array.length; index++) {
  const element = array[index];
  
}
    if (!token)

      return res.status(401)
      .json({
         message: 'توكنننننن غير موجود' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'توكن غير صالح' });
  }
};

const authOpt = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (err) {}
  next();
};

module.exports = { auth, authOpt };