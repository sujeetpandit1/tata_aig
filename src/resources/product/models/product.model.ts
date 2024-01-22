import { Document, Schema, model } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  reviews: Schema.Types.ObjectId[];
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
}, {timestamps: true});

export const ProductModel = model<Product>('Product', productSchema);


// Add the following lines to associate ProductModel with CartModel
productSchema.virtual('carts', {
  ref: 'Cart',
  localField: '_id',
  foreignField: 'items.productId',
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });