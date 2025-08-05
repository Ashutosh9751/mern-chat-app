import express, { Router } from 'express'
import { adduser, login, logout, register } from '../controller/usermodel.js';
import { islogin } from '../middleware/Auth.js';
import  upload  from '../middleware/multer.js';

const router=express.Router();


router.post('/user/login', login)
router.post('/user/register', upload.single('dp'), register)
router.get('/user/logout',islogin,logout);
router.post('/user/adduser', islogin, adduser);
export default router;