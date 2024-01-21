import express from 'express';
import { delete_product } from '../controllers/delete.product';
import { product_validation } from '../services/product.services';
import { create_product } from '../controllers/create.product';
import { update_products } from '../controllers/update.product';
import { get_products } from '../controllers/get.product.list';

const router = express.Router();


    router.post('/getProducts', get_products );
    router.post('/createProduct', product_validation, create_product);
    router.post('/updateProduct', update_products);
    router.post('/deleteProduct', delete_product);

  
  export default router;