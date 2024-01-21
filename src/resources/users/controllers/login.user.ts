import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { Request, Response } from 'express';
import {UserModel} from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { send_error_response } from "../../../errors_handler/api_error";



export const login = try_and_catch_handler(async (req: Request, res: Response) => {
      let data = req.body;
  
      const { username, password } = data;

        const user: any = await UserModel.findOne({ username });

        if(!user){
            return send_error_response(res, 404, "User Name not Found");
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return send_error_response(res, 401, "Password Mismatch");
        }

        const token: string = jwt.sign({ 
            userID: user._id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
         }, 
         process.env.JWT_SECRET_KEY!,
         {expiresIn: "5d" }
         );

         return res.json({
            status: "success",
            message: "Login Success",
            data: {
              first_name: user.first_name,
              last_name: user.last_name
            },
            token: token,
          });
    
  });