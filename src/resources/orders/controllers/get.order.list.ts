import { NextFunction, Request, Response } from 'express';
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { get_all_orders_s } from '../services/order.services';
import api_response from '../../../errors_handler/api_response';


export const get_all_orders = try_and_catch_handler(async (req: Request, res: Response) => {
      const orders = await get_all_orders_s(req);
      return res.status(200).json(new api_response(undefined, 'Order List Fetched Successfully', orders)); 
});