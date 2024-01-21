import mongoose from 'mongoose';
require('dotenv').config();

export const db = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
    });
    console.log('MongoDB is Connected');
  } catch (error: any) {
    console.error(error.message);
    process.exit(1)
  }
}; 
