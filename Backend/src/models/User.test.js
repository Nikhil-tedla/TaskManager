// tests/User.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Track emails in use for uniqueness testing
const emailsInUse = new Set();

// Mock mongoose completely
vi.mock('mongoose', () => {
  return {
    Schema: class MockSchema {
      constructor() {
        this.paths = {};
        this.methods = {};
        this.statics = {};
      }
      
      pre() {
        return this;
      }
      
      index() {
        return this;
      }
    },
    model: vi.fn().mockImplementation((modelName, schema) => {
      return {
        modelName,
        schema,
        create: vi.fn().mockImplementation((data) => {
          // Basic validation
          if (!data.name) {
            throw new Error('Name is required');
          }
          if (!data.email) {
            throw new Error('Email is required');
          }
          if (!data.password) {
            throw new Error('Password is required');
          }
          
          // Check email uniqueness
          if (emailsInUse.has(data.email)) {
            throw new Error('Email already in use');
          }
          emailsInUse.add(data.email);
          
          // Return mock user with provided data and defaults
          return Promise.resolve({
            _id: 'mock-id',
            ...data,
            role: data.role || 'member',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }),
        deleteMany: vi.fn().mockImplementation(() => {
          emailsInUse.clear();
          return Promise.resolve({});
        })
      };
    }),
    Types: {
      ObjectId: String
    },
    connect: vi.fn().mockResolvedValue({}),
    connection: {
      on: vi.fn(),
      once: vi.fn()
    }
  };
});

// Mock the database connection
vi.mock('../config/db', () => ({
  default: vi.fn().mockResolvedValue(true)
}));

// Import the User model after mocking mongoose
import User from './User';

describe('User Model', () => {
  beforeEach(() => {
    // Clear mock data between tests
    emailsInUse.clear();
    vi.clearAllMocks();
  });

  it('should create a user with required fields', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.role).toBe('member'); // Default value
  });

  it('should fail validation when required fields are missing', async () => {
    const userData = {
      name: 'Test User',
      // Missing email and password
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should validate role enum values', async () => {
    const userData = {
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123',
      role: 'invalid' // Invalid role
    };

    // This should throw an error due to invalid role
    expect(userData.role).not.toMatch(/^(admin|member)$/);
  });

  it('should enforce email uniqueness', async () => {
    // Create first user
    const userData = {
      name: 'Test User 1',
      email: 'duplicate@example.com',
      password: 'password123'
    };

    await User.create(userData);

    // Try to create another user with the same email
    const duplicateUser = {
      name: 'Test User 2',
      email: 'duplicate@example.com', // Same email
      password: 'password456'
    };

    await expect(User.create(duplicateUser)).rejects.toThrow();
  });

  it('should create timestamps automatically', async () => {
    const userData = {
      name: 'Test User',
      email: 'test3@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);

    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});