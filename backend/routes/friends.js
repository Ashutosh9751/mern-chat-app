import express, { Router } from 'express'
import { getFriends } from '../controller/friends.js';
import { islogin } from '../middleware/Auth.js';



const router=express.Router();

router.get('/friends/getfriends',islogin,getFriends)

export default router;