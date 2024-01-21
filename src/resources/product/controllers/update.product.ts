import { Request, Response } from 'express';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import api_response from '../../../errors_handler/api_response';
import { update_product } from '../services/product.services';


export const update_products = try_and_catch_handler(async (req: Request, res: Response) => {
    const { product_id, ...update_data } = req.body;

    const updated_product = await update_product(req, res, product_id, update_data);

    if (updated_product === null) {
        return;
    }

    return res.status(200).json(new api_response(undefined, 'Product updated successfully', updated_product));
});