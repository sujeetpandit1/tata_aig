
import { Request, Response } from 'express';
import { send_error_response } from './api_error';

// Key Validation
export const validate_fields = (req: Request, res: Response, field_allowed: string[]) => {
  const request_body = req.body as Record<string, any>; // Explicitly define the type of req.body as an object

  const received_keys = field_allowed.filter((key) => !(key in request_body));

  if (received_keys.length) {
    send_error_response(res, 400, `Error: Missing ${received_keys.join(', ')} in the request body`);
    return false;
  }

  return true;
};

export const validate_string = function (
    field_value: string | undefined,
    field_name: string,
    fixed_length: number,
    min_length: number,
    max_length: number,
    range_array: any[] | null
  ) {
    const error = {
      message: '',
      code: 0,
    };
  
    if (!field_value || field_value.trim() === '') {
      error.message = `Error: Missing Data for ${field_name}`;
      error.code = 400;
      return error;
    }
  
    if (typeof field_value !== 'string') {
      error.message = `Invalid Data: ${field_name} can only contain a string`;
      error.code = 400;
      return error;
    }
  
    const trimmed_value = field_value.trim();
  
    if (trimmed_value.length === 0) {
      error.message = `Error: Missing Data for ${field_name}`;
      error.code = 400;
      return error;
    }
  
    if (fixed_length !== 0 && trimmed_value.length !== fixed_length) {
      error.message = `Invalid Data: ${field_name} can only contain ${fixed_length} characters`;
      error.code = 400;
      return error;
    }
  
    if (min_length !== 0 && trimmed_value.length < min_length) {
      error.message = `Invalid Data: ${field_name} should contain a minimum of ${min_length} characters`;
      error.code = 400;
      return error;
    }
  
    if (max_length !== 0 && trimmed_value.length > max_length) {
      error.message = `Invalid Data: ${field_name} can only contain up to ${max_length} characters`;
      error.code = 400;
      return error;
    }
  
    if (range_array && range_array.length > 0 && !range_array.includes(trimmed_value)) {
      error.message = `Invalid Data: ${field_name} can only contain ${range_array.join(' or ')} and not ${trimmed_value}`;
      error.code = 400;
      return error;
    }
  
    // If all checks pass, return the error object with an empty message and code 0
    return error;
};
  


//Number Validation

export const validate_number = function (
    field_value: any, // Change the type to the appropriate type for your use case
    field_name: string,
    fixed_length: number,
    min_value: number,
    max_value: number
  ) {
    const error = {
      message: "",
      code: 0,
    };

    const null_or_empty = field_value == null || field_value === "undefined" || field_value === "";
    if (null_or_empty) {
      error.message = `Error: Missing Data for ${field_name}`;
      error.code = 400;
      return error;
    }
  
    // Uncomment and use this section to check if the input is a valid number
    const invalid_number = typeof field_value !== "number" || isNaN(field_value);
    if (invalid_number) {
      error.message = `Invalid Data: ${field_name} must be a valid number`;
      error.code = 400;
      return error;
    }
  
  
    // Validating very large numbers
    const str = `${field_value}`;
    if (str.search("e+") > 0) {
      error.message = `Invalid Data: ${field_name} can only contain numbers lesser than ${max_value}`;
      error.code = 400;
      return error;
    }

    const has_fixed_length = fixed_length !== 0 && str.length !== fixed_length;
    if (has_fixed_length) {
      error.message = `Invalid Data: ${field_name} can only contain ${fixed_length} characters`;
      error.code = 400;
      return error;
    }
  
    if (min_value !== 0 && max_value !== 0) {
      if (field_value < min_value || field_value > max_value) {
        error.message = `Invalid Data: ${field_name} can only contain numbers in the range ${min_value} to ${max_value} and not ${field_value}`;
        error.code = 400;
        return error;
      }
    }
  
    if (min_value !== 0 && field_value < min_value) {
      error.message = `Invalid Data: ${field_name} can only contain numbers greater than ${min_value}`;
      error.code = 400;
      return error;
    }
  
    if (max_value !== 0 && field_value > max_value) {
      error.message = `Invalid Data: ${field_name} can only contain numbers lesser than ${max_value}`;
      error.code = 400;
      return error;
    }
  
    error.message = "";
    error.code = 0;
    return error;
};

// Decimal Validation
export const validate_number_decimal = function (
    field_value: any,
    field_name: string,
    min_value: number,
    max_value: number
    ) {
        const error = {
          message: "",
          code: 0,
        };

    if (field_value === null || field_value === undefined || field_value === "" || field_value === "0" || field_value === 0) {
        error.message = `Error: Missing Data for ${field_name}`;
        error.code = 400;
        return error;
    }

    const parsedValue = Number.parseFloat(field_value);

    if (isNaN(parsedValue)) {
        error.message = `Invalid Data: ${field_name} can only contain numbers`;
        error.code = 400;
        return error;
    }

    if (min_value !== 0 && max_value !== 0) {
        if (parsedValue < min_value || parsedValue > max_value) {
            error.message = `Invalid Data: ${field_name} can only contain values between ${min_value} and ${max_value} and not ${parsedValue}`;
            error.code = 400;
            return error;
        }
    }

    if (min_value !== 0 && parsedValue < min_value) {
        error.message = `Invalid Data: ${field_name} can only contain numbers greater than ${min_value}`;
        error.code = 400;
        return error;
    }

    if (max_value !== 0 && parsedValue > max_value) {
        error.message = `Invalid Data: ${field_name} can only contain numbers lesser than ${max_value}`;
        error.code = 400;
        return error;
    }

    error.message = "";
    error.code = 0;

    return error;
};

  
  
