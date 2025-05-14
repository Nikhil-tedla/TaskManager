// This file is used to set up the test environment for Vitest
import { vi } from 'vitest';

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
process.env.ADMIN_INVITE_TOKEN = '1234';
process.env.MONGO_URI = 'mongodb://localhost:27017/taskmanager_test';

// Mock mongoose connection to prevent actual database connections
vi.mock('mongoose', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    connect: vi.fn().mockResolvedValue({}),
    connection: {
      on: vi.fn(),
      once: vi.fn()
    }
  };
});

// Mock process.exit to prevent tests from exiting
process.exit = vi.fn();

// Mock console methods to reduce noise in test output
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});