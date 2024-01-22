import { Document, Schema, model } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  products_reviewed: Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  products_reviewed: [{ type: Schema.Types.ObjectId, ref: 'Review' }],

}, {timestamps: true});

export const UserModel = model<User>('User', userSchema);
