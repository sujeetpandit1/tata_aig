import express from 'express';
import { add_to_Cart } from '../controllers/create.cart';
import { auth } from '../../../auth/auth.middleware';
import { add_to_cart_service } from '../services/cart.services';

const router = express.Router();


    router.post('/addToCart', auth, add_to_cart_service, add_to_Cart);
    // router.post('/userLogin', login_validation, login);
    // router.post('/userUpdate', auth, update_user);
    // router.post('/deleteUser', auth, delete_user);

  
  export default router;