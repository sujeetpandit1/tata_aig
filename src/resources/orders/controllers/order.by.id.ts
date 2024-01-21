import { NextFunction, Request, Response } from 'express';
import api_response from "../../../errors_handler/api_response";
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { get_order_by_id } from "../services/order.services";

export const get_orders_byid = try_and_catch_handler(async (req: Request, res: Response) => {
    const orders = await get_order_by_id(req, res)
});