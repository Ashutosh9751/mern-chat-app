import express from 'express';
import { getmessages} from '../controller/message.js';
import { islogin } from '../middleware/Auth.js';

const router=express.Router();


router.post('/message/getmessages', islogin, getmessages);
export default router;