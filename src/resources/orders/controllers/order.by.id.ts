import { Request, Response } from 'express';
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { get_order_by_id } from "../services/order.services";

export const get_orders_byid = try_and_catch_handler(async (req: Request, res: Response) => {
    await get_order_by_id(req, res)
});