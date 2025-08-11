import express from 'express';
import { generateotpforforgetpassword, newpassword, verifyotpforforgetpassword } from '../controller/usermodel.js';

const router = express.Router();

router.post('/password/generateotpforforgetpassword',generateotpforforgetpassword)
  // Your logic for generating OTP


router.post('/password/verifyotpforforgetpassword',verifyotpforforgetpassword )


router.post('/password/newpassword',newpassword)


export default router;