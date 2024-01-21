import { Document, Schema, model, Types } from 'mongoose';

interface ProductOrder {
  product_id: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Order extends Document {
  user_id: Types.ObjectId;
  products: ProductOrder[]; 
  status: string;
  total_price: number;
}

const orderSchema = new Schema<Order>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: { type: String, default: 'pending' }, //pending, cancel, complete
    total_price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const OrderModel = model<Order>('Order', orderSchema);
