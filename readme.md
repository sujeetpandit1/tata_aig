# E-commerce API Development

This repository contains the source code for a robust and scalable e-commerce API developed using Node.js, TypeScript, and Express. The API provides comprehensive functionality for product management, user accounts, cart management, reviews and order processing.

## Project Setup and Architecture

### Technologies Used
- Node.js
- TypeScript
- Express
- Jest

### Setup Instructions
1. Clone the repository: `git clone https://github.com/sujeetpandit1/tata_aig.git`
2. Get into folder: `cd <foldername>`
3. Install dependencies: `npm install`
4. Set up environment variables (e.g., database connection details, JWT secret)
   - Create a `.env` file and define variables like `MONGODB_URI`, `JWT_SECRET_KEY` and `PORT`.
5. Run the application: `npm run start:dev`

### Architecture
The project follows a modular and scalable architecture with separation of concerns. Key components include:

#### resources
Contained all requirement cart, orders, products, reviews and users.

##### Controllers
Handle HTTP requests and responses. Controllers are responsible for routing requests to the appropriate services.

##### Models
Define data structures for products, users, cart , reviews and orders. These models ensure consistency in data representation.

#### Auth, Error Handler and db config
Implement authentication and validation middleware. Middleware functions are executed before reaching the route handlers.

#### Directory Structure
```
src/
|-- auth/
|-- db_config/
|-- errors_handler/
|-- resources/
|----resources/cart
|-----cart/controllers
|-----cart/models
|-----cart/routes
|-----cart/services
|----resources/orders
|-----orders/controllers
|-----orders/models
|-----orders/routes
|-----orders/services
|----resources/product
|-----product/controllers
|-----product/models
|-----product/routes
|-----product/services
|----resources/reviews
|-----reviews/controllers
|-----reviews/models
|-----reviews/routes
|-----reviews/services
|----resources/users
|-----users/controllers
|-----users/models
|-----users/routes
|-----users/services
|-- index.ts
|-- ...
```

## Product Management

### Endpoints
- `POST /getProducts`: Retrieve a list of products.
- `POST /createProduct`: Create a new product.
- `POST /updateProduct`: Update details of a specific product.
- `POST /deleteProduct`: Delete a product.

### Data Representation
- Product attributes include name, description, price, and stock availability.

### Validation and Error Handling
- Implement data validation for product-related actions.
- Return appropriate HTTP status codes and error messages.

## User Account Management

### Endpoints
- `POST /createUser`: User registration.
- `POST /userLogin`: User login with JWT token generation.
- `POST /userUpdate`: Update user profile.
- `POST /deleteUser`: Delete user profile

### Security
- Use JWT for secure access.
- Implement password hashing and encryption for data security.

## Cart

### Endpoints
- `POST /addToCart`: Add product to cart.

### Validation and Error Handling
- Implement validation for cart-related operations.
- Handle errors gracefully and return appropriate HTTP status codes.

## Order Processing

### Endpoints
- `POST /createOrder`: Place a new order.
- `POST /allOrders`: Update the status of a specific order.
- `POST /orderById`: Retrieve order details.
- `POST /updateOrder`: Retrieve order history.
- `POST /cancelOrder`: Cancel order.

### Validation and Error Handling
- Implement validation for order-related operations.
- Handle errors gracefully and return appropriate HTTP status codes.

## Data Storage and Persistence

### Database
- Utilize a Non-relational database (e.g., MongoDB) for efficient data storage.
- Establish relationships between products, users, and orders as necessary.


## Reviews

### Endpoints
- `POST /createReview`: Create a new review.
- `POST /updateReview`: Update the review of a specific product.
- `POST /listReview`: Retrieve list review.

### Validation and Error Handling
- Implement validation for review-related operations.
- Handle errors gracefully and return appropriate HTTP status codes.

## Data Storage and Persistence

### Database
- Utilize a Non-relational database (e.g., MongoDB) for efficient data storage.
- Establish relationships between products, users, and orders as necessary.

## Bonus Features - update

### Advanced Search and Filtering
- Add advanced search functionality for products, allowing users to filter by various attributes (e.g., price range, category).

### User Reviews and Ratings
- Implement a system for users to leave reviews and ratings for products.
- Calculate and display product ratings based on user feedback.

### Pagination and Sorting
- Enhance product listing with pagination and sorting options for improved user experience.

## Testing and Quality Assurance

- Wrote comprehensive unit tests for core API functionality using Jest.
- Ensure code coverage and conduct integration testing where applicable.

### JEST test
--test created for product and users only
1. To run test `npm run test` or `npm run --detectOpenHandles`

--Test Result
 Product API
    √ should create a new product (2216 ms)                
    √ should return an error if any field is missing (6 ms)
    √ should get a list of products (106 ms)               
    √ should update the product (179 ms)                   
    √ should delete the product (103 ms)                   
  Users API                                                
    √ should create a new user (352 ms)                    
    √ should return an error if any field is missing (6 ms)
    √ should login with valid credentials (147 ms)         
    √ should delete the user after login (85 ms)           
  Cart API                                                 
    √ should create a new product (100 ms)                 
    √ should create a new user (339 ms)                    
    √ should login with valid credentials (192 ms)         
    √ should product add to cart existing user (757 ms)    
    √ should product delete the product (203 ms)           
    √ should delete the user after login (207 ms)          
  order API                                                
    √ should create a new product (107 ms)                 
    √ should create a new user (504 ms)                    
    √ should login with valid credentials (161 ms)         
    √ should product add to cart existing user (658 ms)    
    √ should create order existing cart and user (717 ms)  
    √ should get a list of orders (408 ms)                 
    √ should get a list of orders by specific id (515 ms)  
    √ should update orders by specific id (303 ms)         
    √ should cancel orders by specific id (614 ms)         
    √ should product delete the product (208 ms)           
    √ should delete the user after login (199 ms)
