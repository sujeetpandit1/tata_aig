
import { Request, Response } from 'express';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import api_response from '../../../errors_handler/api_response';
import { get_product } from '../services/product.services';


export const get_products = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, sort_by = 'createdAt', sort_order = 'desc', search_by, min_price, max_price } = req.body;
        const product = await get_product({ page, limit, sort_by, sort_order, search_by, min_price, max_price });
        return res.status(200).json(new api_response(undefined, 'Products fetched successfully', product));
    } catch (error) {
        console.error("Error in get_products:", error);
        return res.status(500).json(new api_response(undefined, "Internal Server Error", "Error fetching products"));
    }
};
