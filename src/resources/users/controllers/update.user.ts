import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { Request, Response } from 'express';
import { update_user_validation } from "../services/user.services";



export const update_user = try_and_catch_handler(async (req: Request, res: Response) => {
    const {...update_data} = req.body;
    update_user_validation(req, res, update_data);
});