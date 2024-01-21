import { Request, Response } from 'express';
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { cancel_order_and_update_product_s } from "../services/order.services";

export const cancel_orders = try_and_catch_handler(async (req: Request, res: Response) => {
    const orders = await cancel_order_and_update_product_s(req, res)
});