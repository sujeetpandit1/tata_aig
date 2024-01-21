import { Document, Schema, model } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },

}, {timestamps: true});

export const UserModel = model<User>('User', userSchema);
