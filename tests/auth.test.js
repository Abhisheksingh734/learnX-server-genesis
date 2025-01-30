const request = require("supertest");
const app = require("../index"); // Import your Express app
const User = require("../models/User"); // Import the User model
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.test" });

describe("Authentication API Tests", () => {
  // Clear the User collection before running tests
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  // Test case for successful user signup
  it("should sign up a new user", async () => {
    const response = await request(app).post("/signup").send({
      name: "Test User",
      email: "test123@gmail.com",
      password: "Password123@",
      role: "student",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Test User");
    expect(response.body).toHaveProperty("email", "test123@gmail.com");
    expect(response.body).toHaveProperty("role", "student");
    expect(response.body).toHaveProperty("token");
  }, 10000);

  // Test case for duplicate user signup
  it("should not allow duplicate email signup", async () => {
    const response = await request(app).post("/signup").send({
      name: "Test User",
      email: "test123@gmail.com",
      password: "Password123@",
      role: "student",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "User already exists");
  });

  // Test case for successful user signin
  it("should sign in an existing user", async () => {
    const response = await request(app).post("/signin").send({
      email: "test123@gmail.com",
      password: "Password123@",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Test User");
    expect(response.body).toHaveProperty("email", "test123@gmail.com");
    expect(response.body).toHaveProperty("role", "student");
    expect(response.body).toHaveProperty("token");
  });

  // Test case for invalid credentials during signin
  it("should not sign in with invalid credentials", async () => {
    const response = await request(app).post("/signin").send({
      email: "test123@gmail.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid Credentials");
  });
});
