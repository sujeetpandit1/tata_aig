import { Request } from 'express';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import {add_to_cart_service} from '../services/cart.services';


export const add_to_Cart = try_and_catch_handler(async (req: Request) => {   
    const { product_id, quantity } = req.body;
    add_to_cart_service(req, product_id, quantity);
});