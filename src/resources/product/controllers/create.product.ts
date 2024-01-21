
import { Request, Response } from 'express';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import { ProductModel } from '../models/product.model';
import api_response from '../../../errors_handler/api_response';


export const create_product = try_and_catch_handler(async (req: Request, res: Response) => {
    let data = req.body;
    const new_product = await ProductModel.create(data);
    return res.status(201).json(new api_response(undefined, 'Product created successfully', new_product));

});