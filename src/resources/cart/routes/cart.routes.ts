import express from 'express';
import { add_to_Cart } from '../controllers/create.cart';
import { auth } from '../../../auth/auth.middleware';
import { add_to_cart_service } from '../services/cart.services';

const router = express.Router();


    router.post('/addToCart', auth, add_to_cart_service, add_to_Cart);

  
  export default router;