import { Request, Response } from 'express';
import { ProductModel } from '../../product/models/product.model';
import ReviewModel from '../models/reviews.model';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import { send_error_response } from '../../../errors_handler/api_error';
import api_response from '../../../errors_handler/api_response';



export const create_review = try_and_catch_handler (async (req: Request, res: Response) => {
    const { product_id, rating, comment } = req.body;

    const user_id = req.user?.userID;

    const product = await ProductModel.findById(product_id);

    if (!product) {
        return send_error_response(res, 404, "Product not found")
    }

    if (rating !== undefined || comment !== undefined) {
    const review = await ReviewModel.create({
      user_id,
      product_id,
      rating,
      comment,
    });
    return res.status(201).json(new api_response(undefined, "Review created successfully", review));
} else {
    return send_error_response(res, 400, "Review not saved")
}
});