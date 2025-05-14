// // tests/authController.test.js
// import { describe, it, expect, vi, beforeEach, afterEach,beforeAll,afterAll } from 'vitest';
// import request from 'supertest';
// // import user from '../models/User';
// const dotenv = require('dotenv');
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import app from '../app';
// // import user from '../models/User';
// import mongoose from 'mongoose';
// dotenv.config();
// vi.mock('../models/User', () => {
//     return {
//       default: {
//         findOne: vi.fn(),
//         create: vi.fn(),
        
//       }
//     };
//   });
  
// import user from '../models/User';
// vi.mock('../models/User');
// vi.mock('bcrypt');
// vi.mock('jsonwebtoken');

// describe('Auth Controller', () => {
//   const mockUser = {
//     _id: '123',
//     name: 'Test User',
//     email: 'test123@example.com',
//     password: 'hashedpassword',
//     role: 'member',
    
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();
//     req = {
//         user: {
//           id: '123',
//         },
//       };
  
//       res = {
//         status: vi.fn().mockReturnThis(),
//         json: vi.fn(),
//       };
//   });
  
//   describe('POST /register', () => {
//     it('should register a new user', async () => {
//       user.findOne.mockResolvedValue(null);
//       user.create.mockResolvedValue(mockUser);
//       bcrypt.genSalt.mockResolvedValue('salt');
//       bcrypt.hash.mockResolvedValue('hashedpassword');
//       jwt.sign.mockReturnValue('fakeToken');


//       const response = await request(app).post('/api/auth/register').send({
//         name: 'Test User',
//         email: 'test@example.com',
//         password: 'password',
//       });
      
//       expect(response.statusCode).toBe(201);
//       expect(response.body).toHaveProperty('token');
//     },30000);

   
//   });

//   describe('POST /login', () => {
//     it('should login a user with correct credentials', async () => {
//       user.findOne.mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(true);
//       jwt.sign.mockReturnValue('fakeToken');

//       const response = await request(app).post('/api/auth/login').send({
//         email: 'test@example.com',
//         password: 'password',
//       });

//       expect(response.statusCode).toBe(200);
//       expect(response.body).toHaveProperty('token');
//     });

//     it('should return 401 for invalid email', async () => {
//       user.findOne.mockResolvedValue(null);

//       const response = await request(app).post('/api/auth/login').send({
//         email: 'wrong@example.com',
//         password: 'password',
//       });

//       expect(response.statusCode).toBe(401);
//       expect(response.body.message).toBe('Invalid mail or password');
//     });
//   });
//   describe('getuserProfile', () => {
//     const mockUser = {
//       _id: '123',
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'hashedpassword',
//       toObject: () => ({
//         _id: '123',
//         name: 'Test User',
//         email: 'test@example.com',
//       }),
//     };
  
//     let req, res;
  
//     beforeEach(() => {
//       req = {
//         user: {
//           id: '123',
//         },
//       };
  
//       res = {
//         status: vi.fn().mockReturnThis(),
//         json: vi.fn(),
//       };
//     });
  
//     it('should return user profile if user exists', async () => {
//       user.findById.mockResolvedValue(mockUser);
  
//       await getuserProfile(req, res);
  
//       expect(user.findById).toHaveBeenCalledWith('123');
//       expect(res.json).toHaveBeenCalledWith(mockUser);
//     });
  
//     it('should return 404 if user not found', async () => {
//       user.findById.mockResolvedValue(null);
  
//       await getuserProfile(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.json).toHaveBeenCalledWith({ message: 'user not found' });
//     });
  
//     it('should return 500 on error', async () => {
//       user.findById.mockRejectedValue(new Error('DB Error'));
  
//       await getuserProfile(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ message: 'Server Error' });
//     });
//   });
// });
// tests/authControllers.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockRequest, mockResponse } from '../test-utils';
import { registerUser, loginUser, getuserProfile, updateProfile } from './authControllers';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the User model with proper chaining
vi.mock('../models/User', () => {
  // Create mock functions for chained methods
  const mockSelectFn = vi.fn();
  
  return {
    default: {
      findOne: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(() => ({
        select: mockSelectFn
      }))
    }
  };
});

// Import the mocked User model
import user from '../models/User';

// Mock bcrypt and jsonwebtoken
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

// Mock process.env
vi.mock('process.env', () => ({
  JWT_SECRET: 'test_secret',
  ADMIN_INVITE_TOKEN: '1234'
}));

describe('Auth Controllers', () => {
  let req, res;
  
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'member',
    save: vi.fn().mockResolvedValue({
      _id: '123',
      name: 'Updated User',
      email: 'updated@example.com',
      role: 'member'
    })
  };

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    vi.clearAllMocks();
    
    // Set up default mock returns
    user.findOne.mockResolvedValue(null);
    user.create.mockResolvedValue(mockUser);
    user.findById().select.mockResolvedValue(mockUser);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedpassword');
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fakeToken');
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: expect.any(String)
      }));
    });

    it('should return 400 if user already exists', async () => {
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      user.findOne.mockResolvedValue(mockUser);

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'User Email already exists'
      }));
    });

    it('should handle server errors', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      user.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Server Error',
        error: expect.any(String)
      }));
    });
  });

  describe('loginUser', () => {
    it('should login a user with correct credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      user.findOne.mockResolvedValue(mockUser);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: expect.any(String)
      }));
    });

    it('should return 401 for invalid email', async () => {
      req.body = {
        email: 'wrong@example.com',
        password: 'password123'
      };
      
      user.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid mail or password'
      }));
    });

    it('should return 401 for invalid password', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      
      user.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid mail or password'
      }));
    });

    it('should handle server errors', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      user.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Server Error'
      }));
    });
  });

  describe('getuserProfile', () => {
    it('should return user profile if user exists', async () => {
      const mockUserProfile = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com'
      };
      
      user.findById().select.mockResolvedValue(mockUserProfile);

      await getuserProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUserProfile);
    });

    it('should return 404 if user not found', async () => {
      user.findById().select.mockResolvedValue(null);

      await getuserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'user not found'
      }));
    });

    it('should handle server errors', async () => {
      user.findById.mockImplementation(() => {
        throw new Error('Database error');
      });

      await getuserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Server Error'
      }));
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      req.body = {
        name: 'Updated User',
        email: 'updated@example.com'
      };
      
      await updateProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated User',
        email: 'updated@example.com',
        token: expect.any(String)
      }));
    });

    it('should update password if provided', async () => {
      req.body = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword'
      };

      await updateProfile(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 'salt');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated User',
        email: 'updated@example.com',
        token: expect.any(String)
      }));
    });

    it('should return 404 if user not found', async () => {
      user.findById().select.mockResolvedValue(null);

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'user not found'
      }));
    });

    it('should handle server errors', async () => {
      user.findById.mockImplementation(() => {
        throw new Error('Database error');
      });

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Server Error'
      }));
    });
  });
});