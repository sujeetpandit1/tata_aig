import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../index";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product API', () => {

  let productData: {
    data: any; id: any; };

  it('should create a new product', async () => {
    const newProduct = {
      name: 'Laptop',
      description: 'Laptop description',
      price: 50600.00,
      stock: 100
    };

    const response = await request(app)
      .post('/api/product/createProduct')
      .send(newProduct)
      .expect(201);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'Product created successfully',
      data: expect.objectContaining(newProduct),
    });
    productData = response.body
  });

  it('should return an error if any field is missing', async () => {
    const response = await request(app)
    .post('/api/product/createProduct')
    .send({})
    .expect(400);

    expect(response.body).toHaveProperty("message", "Error: Missing name, description, price, stock in the request body");
    expect(response.body).toHaveProperty("status", "failed");
  });

  it('should get a list of products', async () => {
    const getProductsResponse = await request(app)
    .post('/api/product/getProducts')
    .expect(200);

    expect(getProductsResponse.body).toMatchObject({
      status: 'success',
      message: 'Products fetched successfully',
      data: expect.any(Array),
    });
  });

  it('should update the product', async () => {

    const updatedProduct = {
      product_id: productData.data.id,
      name: 'Updated Laptop',
      description: 'Updated laptop description',
      price: 1200.00,
      stock: 80
    };

    const updateResponse = await request(app)
    .post('/api/product/updateProduct')
    .send(updatedProduct)
    .expect(200);

    expect(updateResponse.body).toMatchObject({
      status: 'success',
      message: 'Product updated successfully',
      data: {
        _id: expect.any(String),
        __v: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        id: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
        reviews: expect.any(Array),
      },
    });

  });

    it('should delete the product', async () => {
      const deleteProduct = {
        product_id: productData.data.id,
      };

      await request(app)
      .post('/api/product/deleteProduct')
      .send(deleteProduct)
      .expect(204);
    });

});

describe('Users API', () => {

  let testUser: { username: any; password: any };
  let testUserToken: { username: any; password: any, token: any };

  it('should create a new user', async () => {
    const newUser = {
      username: "hellp",
      email: "hellop@gmail.com",
      password: "Hello@123",
      first_name: "Sujeet",
      last_name: "Pandit"
    };
    testUser = newUser;

    const response = await request(app)
      .post('/api/user/createUser')
      .send(newUser)
      .expect(201);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'User created successfully',
      data: "",
    });
  });

  it('should return an error if any field is missing', async () => {
    const response = await request(app)
      .post('/api/user/createUser')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty("message", "Error: Missing username, first_name, last_name, email, password in the request body");
    expect(response.body).toHaveProperty("status", "failed");
  });

  it('should login with valid credentials', async () => {
    const { username, password } = testUser;

    const response = await request(app)
      .post('/api/user/userLogin')
      .send({
        username,
        password
      })
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'Login Success',
      data: {
        first_name: expect.any(String),
        last_name: expect.any(String),
      },
      token: expect.any(String),
    });
    testUserToken = { username, password, token: response.body.token };
    // console.log(testUserToken);

  });

  // it('should update existing user', async () => {
  //   const updateUser = {
  //     email: "update@gmail.com",
  //     password: "update@123",
  //     first_name: "Tajeesu",
  //     last_name: "Tidanp"
  //   };
  //   console.log(testUserToken.token);
  //   const response = await request(app)
  //     .post('/api/user/userUpdate')
  //     .set('Authorization', `Bearer ${testUserToken.token}`)
  //     .send(updateUser)
  //     .expect(200);
  //     console.log('Response Body:', response.body);
  //   expect(response.body).toMatchObject({
  //     status: 'success',
  //     message: 'User details updated successfully',
  //     data: "",
  //   });
  // });

  it('should delete the user after login', async () => {
    const { username } = testUser;
  await request(app)
    .post('/api/user/deleteUserByUserId')
    .send({ username })
    .expect(204);
  });

});

describe('Cart API', () => {
  let testUser: { username: any; password: any };
  let testData: {
    data: any; id: any;
};
  let testUserToken: { username: any; password: any, token: any };

  it('should create a new product', async () => {
    const newProduct = {
      name: 'Laptop',
      description: 'Laptop description',
      price: 50600.00,
      stock: 100
    };

    const response = await request(app)
      .post('/api/product/createProduct')
      .send(newProduct)
      .expect(201);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'Product created successfully',
      data: expect.objectContaining(newProduct),
    });
    testData = response.body
  });

  it('should create a new user', async () => {
    const newUser = {
      username: "hellp",
      email: "hellop@gmail.com",
      password: "Hello@123",
      first_name: "Sujeet",
      last_name: "Pandit"
    };
    testUser = newUser;

    const response = await request(app)
      .post('/api/user/createUser')
      .send(newUser)
      .expect(201);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'User created successfully',
      data: "",
    });
  });

  it('should login with valid credentials', async () => {
    const { username, password } = testUser;

    const response = await request(app)
      .post('/api/user/userLogin')
      .send({
        username,
        password
      })
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'success',
      message: 'Login Success',
      data: {
        first_name: expect.any(String),
        last_name: expect.any(String),
      },
      token: expect.any(String),
    });
    testUserToken = { username, password, token: response.body.token };
  });

  it('should product add to cart existing user', async () => {
    const addToCart = {
      product_id: testData.data.id,
      quantity: 10
    };
    const response = await request(app)
      .post('/api/cart/addToCart')
      .set('Authorization', `Bearer ${testUserToken.token}`)
      .send(addToCart)
      .expect(201)

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Product added to Cart successfully',
        data: expect.any(Object),
      });

  });

it('should product delete the product', async () => {
  const deleteProduct = {
          product_id: testData.data.id,
        };

        await request(app)
          .post('/api/product/deleteProduct')
          .send(deleteProduct)
          .expect(204);
  });

      it('should delete the user after login', async () => {
    const { username } = testUser;
  await request(app)
    .post('/api/user/deleteUserByUserId')
    .send({ username })
    .expect(204);
  });

});

describe("order API", () => {
  let testUser: { username: any; password: any };
  let testData: {
    data: any;
    id: any;
  };
  let testUserToken: { username: any; password: any; token: any };
  let order: {
    data: any;
    _id: any;
  };

  it("should create a new product", async () => {
    const newProduct = {
      name: "Laptop",
      description: "Laptop description",
      price: 50600.0,
      stock: 100,
    };

    const response = await request(app)
      .post("/api/product/createProduct")
      .send(newProduct)
      .expect(201);

    expect(response.body).toMatchObject({
      status: "success",
      message: "Product created successfully",
      data: expect.objectContaining(newProduct),
    });
    testData = response.body;
  });

  it("should create a new user", async () => {
    const newUser = {
      username: "hellp",
      email: "hellop@gmail.com",
      password: "Hello@123",
      first_name: "Sujeet",
      last_name: "Pandit",
    };
    testUser = newUser;

    const response = await request(app)
      .post("/api/user/createUser")
      .send(newUser)
      .expect(201);

    expect(response.body).toMatchObject({
      status: "success",
      message: "User created successfully",
      data: "",
    });
  });

  it("should login with valid credentials", async () => {
    const { username, password } = testUser;

    const response = await request(app)
      .post("/api/user/userLogin")
      .send({
        username,
        password,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      status: "success",
      message: "Login Success",
      data: {
        first_name: expect.any(String),
        last_name: expect.any(String),
      },
      token: expect.any(String),
    });
    testUserToken = { username, password, token: response.body.token };
  });

  it("should product add to cart existing user", async () => {
    const addToCart = {
      product_id: testData.data.id,
      quantity: 10,
    };
    const response = await request(app)
      .post("/api/cart/addToCart")
      .set("Authorization", `Bearer ${testUserToken.token}`)
      .send(addToCart)
      .expect(201);

    expect(response.body).toMatchObject({
      status: "success",
      message: "Product added to Cart successfully",
      data: expect.any(Object),
    });
  });

  it("should create order existing cart and user", async () => {
    const response = await request(app)
      .post("/api/order/createOrder")
      .set("Authorization", `Bearer ${testUserToken.token}`)
      .expect(201);

    expect(response.body).toMatchObject({
      status: "success",
      message: "Order Placed",
      data: expect.any(Object),
    });
    order = response.body;
  });

  it("should get a list of orders", async () => {
    const getOrderResponse = await request(app)
      .post("/api/order/allOrders")
      .set("Authorization", `Bearer ${testUserToken.token}`)
      .expect(200);

    expect(getOrderResponse.body).toMatchObject({
      status: "success",
      message: "Order List Fetched Successfully",
      data: expect.any(Array),
    });
  });

  it("should get a list of orders by specific id", async () => {
    const orderData = {
      order_id: order.data._id,
    };
    const getOrderResponse = await request(app)
      .post("/api/order/orderById")
      .set("Authorization", `Bearer ${testUserToken.token}`)
      .send(orderData)
      .expect(200);

    expect(getOrderResponse.body).toMatchObject({
      status: "success",
      message: "Order Fetched Successfully",
      data: {
        __v: expect.any(Number),
        _id: expect.any(String),
        createdAt: expect.any(String),
        products: expect.any(Array),
        status: expect.any(String),
        total_price: expect.any(Number),
        updatedAt: expect.any(String),
        user_id: expect.any(String),
      },
    });

    // Optionally, you can perform additional property checks for the products array
    getOrderResponse.body.data.products.forEach((product: any) => {
      expect(product).toMatchObject({
        _id: expect.any(String),
        price: expect.any(Number),
        product_id: {
          __v: expect.any(Number),
          _id: expect.any(String),
          createdAt: expect.any(String),
          description: expect.any(String),
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          reviews: expect.any(Array),
          stock: expect.any(Number),
          updatedAt: expect.any(String),
        },
        quantity: expect.any(Number),
      });
    });
  });

  it("should update orders by specific id", async () => {
    const orderData = {
      order_id: order.data._id,
    };
    const getOrderResponse = await request(app)
      .post("/api/order/updateOrder")
      .set("Authorization", `Bearer ${testUserToken.token}`)
      .send(orderData)
      .expect(200);

    expect(getOrderResponse.body).toMatchObject({
      status: "success",
      message: "Order Updated Successfully",
      data: expect.any(Object),
    });
  });

  it("should cancel orders by specific id", async () => {
    const orderData = {
      order_id: order.data._id,
    };
    const getOrderResponse = await request(app)
      .post("/api/order/cancelOrder")
      .set("Authorization", `Bearer ${testUserToken.token}`)
      .send(orderData)
      .expect(200);

    expect(getOrderResponse.body).toMatchObject({
      status: "success",
      message: "Order Cancelled Successfully",
      data: expect.any(Object),
    });
  });

  it("should product delete the product", async () => {
    const deleteProduct = {
      product_id: testData.data.id,
    };

    await request(app)
      .post("/api/product/deleteProduct")
      .send(deleteProduct)
      .expect(204);
  });

  it("should delete the user after login", async () => {
    const { username } = testUser;
    await request(app)
      .post("/api/user/deleteUserByUserId")
      .send({ username })
      .expect(204);
  });
});
