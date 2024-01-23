import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await mongoose.connection.collection('products').deleteMany({});
}, 10000);


describe('Product API', () => {
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

  it('should update a product', async () => {
    const originalProduct = {
      name: 'Original Laptop',
      description: 'Original laptop description',
      price: 1000.00,
      stock: 20
    };

    const createResponse = await request(app)
      .post('/api/product/createProduct')
      .send(originalProduct)
      .expect(201);

    const updatedProduct = {
      product_id: createResponse.body.data.id,
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

  it('should delete a product', async () => {
    const newProduct = {
      name: 'To Be Deleted Laptop',
      description: 'To Be Deleted laptop description',
      price: 1500.00,
      stock: 30
    };
  
    const createResponse = await request(app)
      .post('/api/product/createProduct')
      .send(newProduct)
      .expect(201);
  
    const deleteProduct = {
      product_id: createResponse.body.data.id,
    };
  
    await request(app)
      .post('/api/product/deleteProduct')
      .send(deleteProduct)
      .expect(204);
  
    const getDeletedProductResponse = await request(app)
      .post('/api/product/getProducts')
      .expect(200);
  
    const deletedProductId = createResponse.body.data.id;
    const deletedProductIndex = getDeletedProductResponse.body.data.findIndex((product: any) => product.id === deletedProductId);
    expect(deletedProductIndex).toBe(-1);
  });
  
});

describe('Users API', () => {

  let testUser: { username: any; password: any };
  
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
  });

  it('should delete the user after login', async () => {
    const { username } = testUser; 
  await request(app)
    .post('/api/user/deleteUserByUserId')
    .send({ username })
    .expect(204);
  });
  
  
});
