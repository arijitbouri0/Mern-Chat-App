import express from 'express';
import { register, login, getMyProfile, logout, searchUser, sendRequest, acceptRequest, getMyNotification, getMyFriends, editUser } from '../controller/user.controller.js';
import { singleAvatar } from '../middlewares/multer.js';
import { authenticate } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, validate } from '../lib/validators.js';

const router = express.Router();

router.post('/register',singleAvatar,registerValidator(),validate,register);


router.post('/login',loginValidator(),validate,login);

router.use(authenticate);
router.post('/edit',singleAvatar,validate,editUser);
router.get("/me",getMyProfile)
router.get("/logout",logout)
router.get("/search",searchUser)
router.put("/sendRequest",sendRequest)
router.put("/acceptRequest",acceptRequestValidator(),validate,acceptRequest)
router.get("/notification",getMyNotification)
router.get("/myfriends",getMyFriends)

export default router;

