import { Request, Response, NextFunction } from "express";
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { validate_fields, validate_string } from "../../../errors_handler/validation";
import {UserModel} from '../models/user.model'
import { send_error_response } from "../../../errors_handler/api_error";
import api_response from "../../../errors_handler/api_response";
import bcrypt from 'bcrypt';



const hash_password = async (password: string): Promise<string> => {
    const saltRounds = 10; 
    return bcrypt.hash(password, saltRounds);
  };

export const user_validation = try_and_catch_handler(async (req: Request, res: Response, next: NextFunction) => {
    const field_allowed = ['username', 'first_name', 'last_name', 'email', 'password'];

    if (!validate_fields(req, res, field_allowed)) {
        return;
    }

    const {username, first_name, last_name, email, password } = req.body;

    const validated_username = validate_string(username, 'User Name', 0, 5, 5, null);
    if (validated_username.code !== 0) {
        return send_error_response(res, validated_username.code, validated_username.message);
    } else {
        req.body.username = username.toString().trim();
        if (!/^[a-z]+$/.test(req.body.username)) {
            return send_error_response(res, 400, "Only alphabet in small character allowed");
        }
        let check_username = await UserModel.findOne({username: req.body.username});
        if(check_username){
            return send_error_response(res, 400,  'User Name Already Exist');
        }
    }

    const validated_first_name = validate_string(first_name, 'First Name', 0, 0, 50, null);
    if (validated_first_name.code !== 0) {
        return send_error_response(res, validated_first_name.code, validated_first_name.message);
    } else {
        if (!/^[a-zA-Z]+$/.test(req.body.first_name)) {
            return send_error_response(res, 400, "Only alphabet allowed");
        }
        req.body.first_name = first_name.toString().trim();
    }

    const validated_last_name = validate_string(last_name, 'Last Name', 0, 0, 50, null);
    if (validated_last_name.code !== 0) {
        return send_error_response(res, validated_last_name.code, validated_last_name.message);
    } else {
        if (!/^[a-zA-Z]+$/.test(req.body.last_name)) {
            return send_error_response(res, 400, "Only alphabet allowed");
        }
        req.body.last_name = last_name.toString().trim();
    }

    const validated_email = validate_string(email, 'Email', 0, 0, 150, null);
    if (validated_email.code !== 0) {
    return send_error_response(res, validated_email.code, validated_email.message);
    } else {
    req.body.email = email.toString().trim();
    if (!/^\s*[a-zA-Z][a-zA-Z0-9]*([-\.\_\+][a-zA-Z0-9]+)*\@[a-zA-Z]+(\.[a-zA-Z]{2,5})+\s*$/.test(req.body.email)) {
        return send_error_response(res, 400, "Only valid email allowed");
    }
    let check_email = await UserModel.findOne({ email: req.body.email });
    if (check_email) {
        return send_error_response(res, 400,  'Email Already Exist');
    }
    }

    const validated_password = validate_string(password, 'Password', 0, 8, 16, null);
    if (validated_password.code !== 0) {
    return send_error_response(res, validated_password.code, validated_password.message);
    } else {
    // req.body.password = password.toString().trim();
    if (!/^\s*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}\s*$/.test(req.body.password)) {
        return send_error_response(res, 400, "Only valid password allowed, Min 8 Max 16, with alpha numeric and special character");
    }
    req.body.password = await hash_password(password.toString().trim());
    }
  next();
});

export const login_validation = try_and_catch_handler(async (req: Request, res: Response, next: NextFunction) => {
    const field_allowed = ['username', 'password'];

    if (!validate_fields(req, res, field_allowed)) {
        return;
    }

    const {username, password } = req.body;

    const validated_username = validate_string(username, 'User Name', 0, 5, 5, null);
    if (validated_username.code !== 0) {
        return send_error_response(res, validated_username.code, validated_username.message);
    } else {
        if (!/^[a-z]+$/.test(req.body.username)) {
            return send_error_response(res, 400, "Only alphabet in small character allowed");
        }
        req.body.username = username.toString().trim();    
    }

    const validated_password = validate_string(password, 'Password', 0, 8, 16, null);
    if (validated_password.code !== 0) {
    return send_error_response(res, validated_password.code, validated_password.message);
    } else {
    req.body.password = password.toString().trim();
    }
  next();
});


export const update_user_validation = try_and_catch_handler(async (req: Request, res: Response, update_data: any) => {
    
        const user_id = req.user?.userID;   

        const existing_user = await UserModel.findById(user_id);

        if (!existing_user || existing_user === null) {
            return send_error_response(res, 404, "User Not Found");
        }
    
        if (update_data.first_name) {
            const validated_first_name = validate_string(update_data.first_name, 'First Name', 0, 0, 50, null);
            if (validated_first_name.code !== 0) {
                return send_error_response(res, validated_first_name.code, validated_first_name.message);
            } else {
                if (!/^[a-zA-Z]+$/.test(req.body.first_name)) {
                    return send_error_response(res, 400, "Only alphabet allowed");
                }
                existing_user.first_name = update_data.first_name.toString().trim();            
            }
        }  
        if (update_data.last_name) {
            const validated_last_name = validate_string(update_data.last_name, 'Last Name', 0, 0, 50, null);
            if (validated_last_name.code !== 0) {
                return send_error_response(res, validated_last_name.code, validated_last_name.message);
            } else {
                if (!/^[a-zA-Z]+$/.test(req.body.last_name)) {
                    return send_error_response(res, 400, "Only alphabet allowed");
                }
                existing_user.last_name = update_data.last_name.toString().trim();
            }
        }
        
        if (update_data.email) {
            const validated_email = validate_string(update_data.email, 'Email', 0, 0, 150, null);
            if (validated_email.code !== 0) {
            return send_error_response(res, validated_email.code, validated_email.message);
            } else {
                if (!/^\s*[a-zA-Z][a-zA-Z0-9]*([-\.\_\+][a-zA-Z0-9]+)*\@[a-zA-Z]+(\.[a-zA-Z]{2,5})+\s*$/.test(req.body.email)) {
                    return send_error_response(res, 400, "Only valid email allowed");
                }
                existing_user.email = update_data.email.toString().trim();
            
                let check_email = await UserModel.findOne({ email: req.body.email });
                if (check_email) {
                    return res.status(400).json(new api_response(undefined, 'Email Already Exist', ""));
                }
            }
        }

        if (update_data.password) {
            const validated_password = validate_string(update_data.password, 'Password', 0, 8, 16, null);
            if (validated_password.code !== 0) {
            return send_error_response(res, validated_password.code, validated_password.message);
            } else { 
                if (!/^\s*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}\s*$/.test(req.body.password)) {
                    return send_error_response(res, 400, "Only valid password allowed, Min 8 Max 16, with alpha numeric and special character");
                }
                existing_user.password = await hash_password(update_data.password.toString().trim());
            }
        }

        await existing_user.save(); 
        return res.status(200).json(new api_response(undefined, 'User details updated successfully', ""));        
});