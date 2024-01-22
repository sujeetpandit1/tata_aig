import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model';
import { CartModel } from '../../cart/models/cart.model';
import { send_error_response } from '../../../errors_handler/api_error';
import mongoose from 'mongoose';
import api_response from '../../../errors_handler/api_response';
import { validate_fields, validate_string } from '../../../errors_handler/validation';
import { ProductModel } from '../../product/models/product.model';

export const create_order_services = async (req: Request, res: Response) => {
  
  const user_id : any= req.user?.userID;

  // Convert user_id to ObjectId
  const user_obj_id = new mongoose.Types.ObjectId(user_id);
  // Retrieve cart items for the user
  const cart:any = await CartModel.findOne({ user_id:user_obj_id }).populate('items.product_id');

  if (!cart || cart.items.length === 0) {
    return send_error_response(res, 404, "Cart is empty. Add items to the cart before creating an order.");
  }

  // Calculate total price and items for the order
  const total_price = cart.total_price;
  const total_items = cart.total_items;

  // Extract product details from the cart
  const order_items: any = cart.items.map((item: any) => ({
    product_id: item.product_id._id,
    quantity: item.quantity,
    price: item.product_id.price,
  }));

//   Create a new order
  const new_order = {
    user_id: user_obj_id,
    products: order_items,
    total_price,
    total_items,
  };

  const order = await OrderModel.create(new_order);

  await CartModel.findOneAndDelete({ user_id });

  return res.status(201).json(new api_response(undefined, 'Order Placed', order));;

};

export const get_all_orders_s = async (req:Request) => {
    const user_id = req.user?.userID;
    return OrderModel.find({ user_id }).populate('products.product_id');
};

export const get_order_by_id = async (req:Request, res:Response) => {
    const user_id = req.user?.userID;
    const field_allowed = ['order_id'];

  if (!validate_fields(req, res, field_allowed)) {
    return;
  }

  const { order_id } = req.body;

  const validated_order_id = validate_string(order_id, 'Order Id', 0, 24, 24, null);
  if (validated_order_id.code !== 0) {
    return send_error_response(res, validated_order_id.code, validated_order_id.message);
  } else if (!mongoose.Types.ObjectId.isValid(order_id)) {
    return send_error_response(res, 400, "Invalid Order Id");
  }
  const order = await OrderModel.findOne({ _id: order_id, user_id }).populate('products.product_id');
  return res.status(200).json(new api_response(undefined, 'Order Fetched Successfully', order));
};

export const update_order_by_product_id_s = async (req: Request, res: Response) => {
  const user_id = req.user?.userID;
  const field_allowed = ['order_id']; 

  if (!validate_fields(req, res, field_allowed)) {
    return;
  }

  const { order_id } = req.body;

  const validated_order_id = validate_string(order_id, 'Order Id', 0, 24, 24, null);
  if (validated_order_id.code !== 0) {
    return send_error_response(res, validated_order_id.code, validated_order_id.message);
  } else if (!mongoose.Types.ObjectId.isValid(order_id)) {
    return send_error_response(res, 400, "Invalid Order Id");
  }

  // Check if the order is already completed
    const existing_order = await OrderModel.findOne({ _id: order_id, user_id });

    if (!existing_order) {
    return send_error_response(res, 404, "Order not found");
    }

    if (existing_order.status === 'complete') {
    return send_error_response(res, 400, "Order is already complete. No further action allowed.");
    }

  // Assuming status should be updated to 'complete'
  const updated_order = await OrderModel.findOneAndUpdate(
    { _id: order_id, user_id },
    { $set: { 'status': 'complete' } },
    { new: true }
  )

  if (!updated_order) {
    return send_error_response(res, 404, "Order not found");
  }

  return res.status(200).json(new api_response(undefined, 'Order Updated Successfully', updated_order));
};

export const cancel_order_and_update_product_s = async (req: Request, res: Response) => {
  const user_id = req.user?.userID;
  const field_allowed = ['order_id'];

  if (!validate_fields(req, res, field_allowed)) {
    return;
  }

  const { order_id } = req.body;

  const validated_order_id = validate_string(order_id, 'Order Id', 0, 24, 24, null);
  if (validated_order_id.code !== 0) {
    return send_error_response(res, validated_order_id.code, validated_order_id.message);
  } else if (!mongoose.Types.ObjectId.isValid(order_id)) {
    return send_error_response(res, 400, 'Invalid Order Id');
  }

  // Check if the order is already completed
  const existing_order = await OrderModel.findOne({ _id: order_id, user_id });

  if (!existing_order) {
    return send_error_response(res, 404, 'Order not found');
  }

  if (existing_order.status === 'cancelled') {
    return send_error_response(res, 400, 'Order is already cancelled. No further action allowed.');
  }

  // Assuming status should be updated to 'cancelled'
  const updated_order = await OrderModel.findOneAndUpdate(
    { _id: order_id, user_id },
    { $set: { status: 'cancelled' } },
    { new: true }
  );

  if (!updated_order) {
    return send_error_response(res, 404, 'Order not found');
  }

  // Add the cancelled quantity back to the product
  const products = updated_order.products;
  for (const product of products) {
    const { product_id, quantity } = product;
  
    // Convert product_id to ObjectId
    const objectIdProductId = new mongoose.Types.ObjectId(product_id);
  
    // Update product quantity in the database
    await ProductModel.findOneAndUpdate(
      { _id: objectIdProductId },
      { $inc: { stock: quantity } }, // Increment the quantity by the cancelled quantity
      { new: true }
    );
   
  }

  return res.status(200).json(new api_response(undefined, 'Order Cancelled Successfully', updated_order));
};
