import { NextFunction, Request, Response } from 'express';
import { send_error_response } from "../../../errors_handler/api_error";
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { validate_fields, validate_number, validate_string } from "../../../errors_handler/validation";
import { ProductModel } from "../../product/models/product.model";
import { CartModel } from "../models/cart.model";
import mongoose from 'mongoose';
import api_response from '../../../errors_handler/api_response';

export const add_to_cart_service = try_and_catch_handler(async (req: Request, res: Response, next: NextFunction) => {
  const field_allowed = ['product_id', 'quantity'];

  if (!validate_fields(req, res, field_allowed)) {
    return;
  }

  const user_id = req.user?.userID;
  const { product_id, quantity } = req.body;

  const { code: productIdCode, message: productIdMessage } = validate_string(product_id, 'Product Id', 0, 24, 24, null);
  if (productIdCode !== 0) {
    return send_error_response(res, productIdCode, productIdMessage);
  } else if (!mongoose.Types.ObjectId.isValid(product_id)) {
    return send_error_response(res, 400, "Invalid Product Id");
  }

  const { code: quantityCode, message: quantityMessage } = validate_number(quantity, 'Quantity', 0, 1, 100);
  if (quantityCode !== 0) {
    return send_error_response(res, quantityCode, quantityMessage);
  }

  const product = await ProductModel.findById(product_id);
  if (!product) {
    return send_error_response(res, 404, "Product Not Found");
  }

  if (quantity > product.stock) {
    return send_error_response(res, 400, "Insufficient Stock");
  }

  const filter = { user_id, 'items.product_id': product_id };
  const update = {
    $inc: {
      'items.$.quantity': quantity,
      total_price: product.price * quantity,
      total_items: quantity,
    },
  };

  let cart = await CartModel.findOneAndUpdate(filter, update, { new: true });

  if (!cart) {
    // If the cart doesn't exist for the user or the product is not in the cart
    cart = await CartModel.findOneAndUpdate(
      { user_id },
      {
        $push: {
          items: { product_id, quantity },
        },
        $inc: {
          total_price: product.price * quantity,
          total_items: quantity,
        },
      },
      { upsert: true, new: true }
    );
  }

  // Subtract the purchased quantity from the available stock
  await ProductModel.findByIdAndUpdate(product_id, { $inc: { stock: -quantity } });

  return res.status(201).json(new api_response(undefined, 'Product added to Cart successfully', cart));
});
