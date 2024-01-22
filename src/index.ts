import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import Product_Routes from "./resources/product/routes/product.routes"
import User_Routes from "./resources/users/routes/user.routes"
import Order_Routes from "./resources/orders/routes/order.routes"
import Cart_Routes from "./resources/cart/routes/cart.routes"
import Review_Routes from "./resources/reviews/routes/review.toutes"
import { db } from "./db_config/db_config";

require('dotenv').config();


const app = express();

// app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

//DB Connect
db();

// Global JSON handler
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ status: "failed", message: 'Invalid Data : Content in body is in invalid format' });
  } else {
    next();
  }
});

app.use('/api/product', Product_Routes);
app.use('/api/user', User_Routes);
app.use('/api/order', Order_Routes);
app.use('/api/cart', Cart_Routes);
app.use('/api/review', Review_Routes);

// Global error handler middleware
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Specify the path to the log file in the src/logs folder
  const logFilePath = path.join(__dirname, "logs", "error.log");

  // Log the error to a file
  const logStream = fs.createWriteStream(logFilePath, { flags: "a" });
  logStream.write(`${new Date().toISOString()}: ${err.stack}\n`);
  logStream.end();

  if (!res.headersSent) {
    res.status(500).send({ status: "failed", message: "Something Went Wrong, Try after sometime" });
  }

  next(err); 
});

app.all("/**", (_req, res) => {
  res
    .status(404)
    .send({ status: "failed", message: "Requested URL not Available" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});