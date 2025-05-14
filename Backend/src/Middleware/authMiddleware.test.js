// tests/authMiddleware.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { protect, adminOnly } from './authMiddleware';

// Mock the User model with proper chaining
vi.mock('../models/User', () => {
  // Create mock functions for chained methods
  const mockSelectFn = vi.fn();
  
  return {
    default: {
      findById: vi.fn(() => ({
        select: mockSelectFn
      }))
    }
  };
});

// Import the mocked User model
import user from '../models/User';

// Mock jsonwebtoken
vi.mock('jsonwebtoken');

// Mock process.env
vi.mock('process.env', () => ({
  JWT_SECRET: 'test_secret'
}));

describe('Auth Middleware', () => {
  let req, res, next;
  const mockUser = {
    _id: '60d21b4667d0d8992e610c85',
    name: 'Test User',
    email: 'test@example.com',
    role: 'member'
  };

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    next = vi.fn();
    vi.clearAllMocks();
    
    // Set up the select mock to return the user
    user.findById().select.mockResolvedValue(mockUser);
  });

  describe('protect middleware', () => {
    

    it('should return 401 if no token is provided', async () => {
      // Execute
      await protect(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized,no token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      // Setup
      req.headers.authorization = 'Bearer invalidtoken';
      jwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      // Execute
      await protect(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'jwt malformed',
        message: 'token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('adminOnly middleware', () => {
    it('should call next() if user is admin', async () => {
      // Setup
      req.user = {
        _id: '60d21b4667d0d8992e610c85',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };

      // Execute
      await adminOnly(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', async () => {
      // Setup
      req.user = {
        _id: '60d21b4667d0d8992e610c85',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'member'
      };

      // Execute
      await adminOnly(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'access denied,admin only'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});