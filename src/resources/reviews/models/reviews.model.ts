import mongoose, { Document, Schema } from 'mongoose';

interface Review extends Document {
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number },
  comment: { type: String },
});

const ReviewModel = mongoose.model<Review>('Review', reviewSchema);

export default ReviewModel;
