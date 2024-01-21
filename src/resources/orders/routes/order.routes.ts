import express from 'express';
import { create_order } from '../controllers/create.order';
import { auth } from '../../../auth/auth.middleware';
import { get_all_orders } from '../controllers/get.order.list';
import { get_orders_byid } from '../controllers/order.by.id';
import { update_orders_byid } from '../controllers/update.order';
import { cancel_orders } from '../controllers/cancel.order';

const router = express.Router();


    router.post('/createOrder', auth, create_order);
    router.post('/allOrders', auth, get_all_orders);
    router.post('/orderById', auth, get_orders_byid);
    router.post('/updateOrder', auth, update_orders_byid);
    router.post('/cancelOrder', auth, cancel_orders);

  
  export default router; 