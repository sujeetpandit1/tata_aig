import { Request, Response, NextFunction } from "express";
import try_and_catch_handler from "../../../errors_handler/try_catch_handler";
import { validate_fields, validate_number, validate_number_decimal, validate_string } from "../../../errors_handler/validation";
import { send_error_response } from "../../../errors_handler/api_error";
import { Product, ProductModel } from "../models/product.model";


export const product_validation = try_and_catch_handler(async (req: Request, res: Response, next: NextFunction) => {
    const field_allowed = ['name', 'description', 'price', 'stock'];

  if (!validate_fields(req, res, field_allowed)) {
    return;
  }

  const {name, price, description, stock } = req.body;

  const validated_name = validate_string(name, 'Name', 0, 5, 100, null);
  if (validated_name.code !== 0) {
    return send_error_response(res, validated_name.code, validated_name.message);
  } else {
    req.body.name = name.toString().trim();
  }

  const validated_price = validate_number_decimal(price, 'Price', 0, 2147483647);
  if (validated_price.code !== 0) {
    return send_error_response(res, validated_price.code, validated_price.message);
  } else {
    req.body.price = price;
  }
  
  const validated_stock = validate_number(stock, 'Stock', 0, 0, 2147483647);
  if (validated_stock.code !== 0) {
      return send_error_response(res, validated_stock.code, validated_stock.message);
  } else {
      req.body.stock = stock;
  }

  const trimmed_description = description ? description.trim() : description;
  req.body.description = trimmed_description;

  next();
});

export const get_product = async (query: any): Promise<Product[]> => {
    const pipeline = [];

    // Match stage for filtering
    if (query.search_by) {
        pipeline.push({ $match: { name: { $regex: new RegExp(query.search_by, 'i') } } });
    }
    if (query.min_price || query.max_price) { 
        const price_match: any = {};
        if (query.min_price) price_match.$gte = parseInt(query.min_price);
        if (query.max_price) price_match.$lte = parseInt(query.max_price);
        pipeline.push({ $match: { price: price_match } });
    }

    // Sort stage
    const sort_options: any = {};
    sort_options[query.sort_by || 'createdAt'] = query.sort_order === 'desc' ? -1 : 1;
    pipeline.push({ $sort: sort_options });

    // Pagination stage
    const skip = (parseInt(query.page) - 1) * parseInt(query.limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(query.limit) });

    // Aggregation
    const products = await ProductModel.aggregate(pipeline);
    // console.log(products);
    
    return products;
};

export const update_product = async (req: Request, res: Response, product_id: any, update_data: any): Promise<Product | null> => {
    try {
        // Check if product exists
        const existing_product = await ProductModel.findById(product_id);

        if (!existing_product) {
            send_error_response(res, 404, "Data Not Found");
            return null;
        }

        // Update specific fields
        if (update_data.name) {
            const validated_name = validate_string(update_data.name, 'Name', 0, 5, 100, null);
            if (validated_name.code !== 0) {
              send_error_response(res, validated_name.code, validated_name.message);
            } else {
              existing_product.name = update_data.name.toString().trim();
            }
          }
         
        if (update_data.description) {
            const validated_name = validate_string(update_data.description, 'Description', 0, 5, 1000, null);
            if (validated_name.code !== 0) {
              send_error_response(res, validated_name.code, validated_name.message);
            } else {
              existing_product.description = update_data.description.toString().trim();
            }
        }
        if (update_data.price) {
            const validated_price = validate_number_decimal(update_data.price, 'Price', 0, 2147483647);
            if (validated_price.code !== 0) {
                send_error_response(res, validated_price.code, validated_price.message);
            } else {
                existing_product.price = update_data.price;
            }
        }
        // Add stocks if available
        if (update_data.stock && !isNaN(update_data.stock)) {
          const validated_stock = validate_number(update_data.stock, 'Stock', 0, 0, 2147483647);
          if (validated_stock.code !== 0) {
              send_error_response(res, validated_stock.code, validated_stock.message);
          } else {
            existing_product.stock = (existing_product.stock || 0) + parseInt(update_data.stock);
          }
        }
        // Save the updated product
        const updated_product = await existing_product.save();
        return updated_product;
    } catch (error) {
        // Handle errors, you might want to log or send an error response here
        console.error("Error updating product:", error);
        return null;
    }
};


