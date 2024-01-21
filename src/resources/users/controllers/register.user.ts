import { Request, Response } from 'express';
import {UserModel} from '../models/user.model';
import try_and_catch_handler from '../../../errors_handler/try_catch_handler';
import api_response from '../../../errors_handler/api_response';

export const register_user = try_and_catch_handler(async (req: Request, res: Response) => {   
    let data = req.body;
    await UserModel.create(data);
    return res.status(201).json(new api_response(undefined, 'User created successfully', ""));
});

