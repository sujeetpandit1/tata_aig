import express from 'express';
import { login_validation, user_validation } from '../services/user.services';
import { register_user } from '../controllers/register.user';
import { login } from '../controllers/login.user';
import { update_user } from '../controllers/update.user';
import { auth } from '../../../auth/auth.middleware';
import { delete_user, delete_user_byuserid } from '../controllers/delete.user';

const router = express.Router();


    router.post('/createUser', user_validation, register_user);
    router.post('/userLogin', login_validation, login);
    router.post('/userUpdate', auth, update_user);
    router.post('/deleteUser', auth, delete_user);
    router.post('/deleteUserByUserId', delete_user_byuserid);

  
  export default router;