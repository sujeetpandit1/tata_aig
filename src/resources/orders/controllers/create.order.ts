import { Request, Response } from 'express';
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { create_order_services } from '../services/order.services';

export const create_order = try_and_catch_handler(async (req: Request, res: Response) => {
      await create_order_services(req, res);
  });
