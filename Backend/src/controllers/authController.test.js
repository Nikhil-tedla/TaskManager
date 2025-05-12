// tests/authController.test.js
import { describe, it, expect, vi, beforeEach, afterEach,beforeAll,afterAll } from 'vitest';
import request from 'supertest';
// import user from '../models/User';
const dotenv = require('dotenv');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../app';
// import user from '../models/User';
import mongoose from 'mongoose';
dotenv.config();
vi.mock('../models/User', () => {
    return {
      default: {
        findOne: vi.fn(),
        create: vi.fn(),
        
      }
    };
  });
  
import user from '../models/User';
vi.mock('../models/User');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Auth Controller', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test123@example.com',
    password: 'hashedpassword',
    role: 'member',
    
  };

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
        user: {
          id: '123',
        },
      };
  
      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
  });
  
  describe('POST /register', () => {
    it('should register a new user', async () => {
      user.findOne.mockResolvedValue(null);
      user.create.mockResolvedValue(mockUser);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpassword');
      jwt.sign.mockReturnValue('fakeToken');


      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('token');
    },30000);

   
  });

  describe('POST /login', () => {
    it('should login a user with correct credentials', async () => {
      user.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fakeToken');

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid email', async () => {
      user.findOne.mockResolvedValue(null);

      const response = await request(app).post('/api/auth/login').send({
        email: 'wrong@example.com',
        password: 'password',
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid mail or password');
    });
  });
  describe('getuserProfile', () => {
    const mockUser = {
      _id: '123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      toObject: () => ({
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
      }),
    };
  
    let req, res;
  
    beforeEach(() => {
      req = {
        user: {
          id: '123',
        },
      };
  
      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
    });
  
    it('should return user profile if user exists', async () => {
      user.findById.mockResolvedValue(mockUser);
  
      await getuserProfile(req, res);
  
      expect(user.findById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  
    it('should return 404 if user not found', async () => {
      user.findById.mockResolvedValue(null);
  
      await getuserProfile(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'user not found' });
    });
  
    it('should return 500 on error', async () => {
      user.findById.mockRejectedValue(new Error('DB Error'));
  
      await getuserProfile(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server Error' });
    });
  });
});
