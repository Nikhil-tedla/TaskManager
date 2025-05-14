// Test utilities for mocking models and middleware
import { vi } from 'vitest';

// Mock Task model
export const mockTaskModel = {
  find: vi.fn().mockReturnThis(),
  findById: vi.fn().mockReturnThis(),
  findByIdAndDelete: vi.fn(),
  create: vi.fn(),
  countDocuments: vi.fn(),
  aggregate: vi.fn(),
  populate: vi.fn().mockReturnThis(),
  sort: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  select: vi.fn()
};

// Mock User model
export const mockUserModel = {
  find: vi.fn().mockReturnThis(),
  findOne: vi.fn(),
  findById: vi.fn().mockReturnThis(),
  findByIdAndDelete: vi.fn(),
  create: vi.fn(),
  select: vi.fn()
};

// Mock mongoose
export const mockMongoose = {
  Schema: function() {
    return {
      pre: vi.fn().mockReturnThis(),
      index: vi.fn().mockReturnThis()
    };
  },
  model: vi.fn().mockImplementation(() => mockTaskModel),
  Types: {
    ObjectId: vi.fn().mockImplementation(() => 'mock-object-id')
  },
  connect: vi.fn().mockResolvedValue({}),
  connection: {
    close: vi.fn().mockResolvedValue({})
  }
};

// Mock request and response objects
export const mockRequest = (overrides = {}) => {
  return {
    user: {
      _id: '60d21b4667d0d8992e610c85',
      id: '60d21b4667d0d8992e610c85',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    },
    params: {},
    query: {},
    body: {},
    headers: {},
    ...overrides
  };
};

export const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

// Mock JWT and bcrypt
export const mockJwt = {
  sign: vi.fn().mockReturnValue('mock-token'),
  verify: vi.fn().mockReturnValue({ id: '60d21b4667d0d8992e610c85' })
};

export const mockBcrypt = {
  genSalt: vi.fn().mockResolvedValue('mock-salt'),
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true)
};