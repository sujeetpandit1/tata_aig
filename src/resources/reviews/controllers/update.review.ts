import { Request, Response } from 'express';
import ReviewModel from '../models/reviews.model';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import { send_error_response } from '../../../errors_handler/api_error';
import api_response from '../../../errors_handler/api_response';
import mongoose from 'mongoose';



export const update_review = try_and_catch_handler(async (req: Request, res: Response) => {
    const { product_id, rating, comment } = req.body;

    const object_product_id = new mongoose.Types.ObjectId(product_id);

    if (rating !== undefined || comment !== undefined) {
        const updated_review = await ReviewModel.findOneAndUpdate(
            { product_id: object_product_id },
            { rating, comment },
            { new: true } 
        );

        if (!updated_review) {
            return send_error_response(res, 404, 'Review not found for this product');
        }

        return res.status(200).json(new api_response(undefined, 'Review updated successfully', updated_review));
    } else {
        return send_error_response(res, 400, "Review not updated");
    }
});


