import { Request, Response } from 'express';
import ReviewModel from "../models/reviews.model";
import { send_error_response } from '../../../errors_handler/api_error';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import mongoose from 'mongoose';




export const get_product_ratings_byid = try_and_catch_handler(async (req: Request, res: Response) => {
      const { product_id } = req.body;

      if (!mongoose.Types.ObjectId.isValid(product_id)) {
        return send_error_response(res, 400, 'Invalid Product Id');
      }
  
      const reviews = await ReviewModel.find({ product_id: product_id });
    
  
      if (reviews.length === 0) {
        return send_error_response(res, 404, "No reviews found for the product")
      }
  
      const total_ratings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average_rating = total_ratings / reviews.length;

        // Prepare an array of review details
        const review_details = reviews.map(review => ({
            rating: review.rating,
            comment: review.comment,
        }));

        // Return all reviews, total rating, and average rating
        return res.status(200).json({status: "success", message: "Review Fetched Successfully",
            reviews: review_details,
            total_ratings,
            average_rating,
        });
  });