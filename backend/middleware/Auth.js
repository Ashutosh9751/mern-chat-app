import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
export const islogin = (req, res, next) => {

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized please login' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized please login' });
    }
    req.user = decoded;
 
    next();
  });
};