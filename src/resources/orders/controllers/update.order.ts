import { Request, Response } from 'express';
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { update_order_by_product_id_s } from "../services/order.services";

export const update_orders_byid = try_and_catch_handler(async (req: Request, res: Response) => {
    await update_order_by_product_id_s(req, res)
});