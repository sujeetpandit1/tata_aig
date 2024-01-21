
import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import { send_error_response } from '../../../errors_handler/api_error';



export const delete_product = try_and_catch_handler(async (req: Request, res: Response) => {
    
    const {product_id }= req.body

    if(!product_id){
        return send_error_response(res, 400, "Please Enter Product Id, You want to delete");
    }
        const deleted_product: any = await ProductModel.findByIdAndDelete(product_id);

        if (!deleted_product) {
            return send_error_response(res, 404, "Product Not Found");
        }

        return res.status(204).end();
});