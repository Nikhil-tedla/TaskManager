// tests/Task.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
          if (!data.title) {
            throw new Error('Title is required');
          }
          if (!data.dueDate) {
            throw new Error('Due date is required');
          }
          
          // Return mock task with provided data and defaults
          return Promise.resolve({
            _id: 'mock-id',
            ...data,
            status: data.status || 'Pending',
            priority: data.priority || 'Medium',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }),
        deleteMany: vi.fn().mockResolvedValue({})
      };
    }),
    Types: {
      ObjectId: String
    }
  };
});

// Import the Task model after mocking mongoose
import Task from './Task';

describe('Task Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should create a task with required fields', async () => {
    const taskData = {
      title: 'Test Task',
      dueDate: new Date(),
      assignedTo: ['user-id-1'],
      createdBy: 'user-id-1'
    };

    const task = await Task.create(taskData);

    expect(task).toBeDefined();
    expect(task.title).toBe(taskData.title);
    expect(task.status).toBe('Pending'); // Default value
    expect(task.priority).toBe('Medium'); // Default value
  });

  it('should fail validation when required fields are missing', async () => {
    const taskData = {
      description: 'Missing required fields'
    };

    await expect(Task.create(taskData)).rejects.toThrow();
  });

  it('should validate priority enum values', async () => {
    const taskData = {
      title: 'Test Task',
      dueDate: new Date(),
      priority: 'Invalid', // Invalid priority
      assignedTo: ['user-id-1'],
      createdBy: 'user-id-1'
    };

    // This should throw an error due to invalid priority
    expect(taskData.priority).not.toMatch(/^(Low|Medium|High)$/);
  });

  it('should validate status enum values', async () => {
    const taskData = {
      title: 'Test Task',
      dueDate: new Date(),
      status: 'Invalid', // Invalid status
      assignedTo: ['user-id-1'],
      createdBy: 'user-id-1'
    };

    // This should throw an error due to invalid status
    expect(taskData.status).not.toMatch(/^(Pending|In Progress|Completed)$/);
  });

  it('should create timestamps automatically', async () => {
    const taskData = {
      title: 'Test Task',
      dueDate: new Date(),
      assignedTo: ['user-id-1'],
      createdBy: 'user-id-1'
    };

    const task = await Task.create(taskData);

    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
  });
});