import jwt from 'jsonwebtoken';

export const islogin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized please login' });
  }
  jwt.verify(token, 'shhhhh', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized please login' });
    }
    req.user = decoded;
 
    next();
  });
};