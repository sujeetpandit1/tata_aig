import { NextFunction, Request, Response } from "express";
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { validate_fields, validate_number, validate_string } from "../../../errors_handler/validation";
import { send_error_response } from "../../../errors_handler/api_error";



export const review_validation = try_and_catch_handler(async (req: Request, res: Response, next: NextFunction) => {
    const allowedFields = ['product_id'];
  
    if (!validate_fields(req, res, allowedFields)) {
      return;
    }
  
    const { product_id, rating, comment } = req.body;
  
    const validatedProductId = validate_string(product_id, 'Product Id', 0, 24, 24, null);
    if (validatedProductId.code !== 0) {
      return send_error_response(res, validatedProductId.code, validatedProductId.message);
    } else {
      req.body.product_id = product_id.toString().trim();
    }
  
    if (rating !== undefined) {
      const validatedRating = validate_number(rating, 'Rating', 0, 1, 5);
      if (validatedRating.code !== 0) {
        return send_error_response(res, validatedRating.code, validatedRating.message);
      } else {
        req.body.rating = rating;
      }
    }
  
    if (comment !== undefined) {
      const validatedComment = validate_string(comment, 'Comment', 0, 1, 100, null);
      if (validatedComment.code !== 0) {
        return send_error_response(res, validatedComment.code, validatedComment.message);
      } else {
        req.body.comment = comment.toString().trim();
      }
    }
    next()
  });
  