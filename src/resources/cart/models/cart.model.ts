import { Schema, Types, model } from 'mongoose';

export interface Cart extends Document {
  productId: Types.ObjectId;
  quantity: number;
}

const cartSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    items: [
      {
        product_id: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
          trim: true,
          min: 1,
        },
      },
    ],
    total_price: {
      type: Number,
      required: true,
      trim: true,
    },
    total_items: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const CartModel = model<Cart>('Cart', cartSchema);
