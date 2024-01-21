import { Request, Response } from "express";
import { send_error_response } from "../../../errors_handler/api_error";
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { UserModel } from "../models/user.model";

export const delete_user = try_and_catch_handler(async (req: Request, res: Response) => {
    
    const user_id = req.user?.userID;
    console.log(user_id);
    

    if(!user_id){
        return send_error_response(res, 400, "Token Missing");
    }
        const deleted_user: any = await UserModel.findByIdAndDelete(user_id);

        if (!deleted_user) {
            return send_error_response(res, 404, "User Not Found");
        }

        return res.status(204).end();
});