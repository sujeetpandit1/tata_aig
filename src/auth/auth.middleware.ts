import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import try_and_catch_handler from "../errors_handler/try_catch_handler";

// Define a custom type for the user data
interface UserData {
  userID: string;
  phone: string;
  uid: string;
}

// Extend the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}

export const auth = try_and_catch_handler((req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ status: "failed", message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as UserData;

    if (!decoded) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid Token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
          message: 'Session Expired',
          error: error.message,
      });
  }

  if (error instanceof JsonWebTokenError || error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
        message: 'Invalid Token',
        error: error.message,
    });
}
  
    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
