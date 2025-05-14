// tests/taskControllers.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockRequest, mockResponse } from '../test-utils';
import { getTasks, getTaskById, createTask, updateTask, deleteTask, getDashboardData, getUserDashboardData } from './taskControllers';

// Mock the Task model with proper chaining
vi.mock('../models/Task', () => {
  // Create mock functions for chained methods
  const mockPopulateFn = vi.fn().mockReturnValue({
    populate: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    select: vi.fn()
  });
  
  // Setup the mock functions
  return {
    default: {
      find: vi.fn(() => ({ 
        populate: mockPopulateFn
      })),
      findById: vi.fn(() => ({ 
        populate: mockPopulateFn
      })),
      create: vi.fn(),
      findByIdAndDelete: vi.fn(),
      countDocuments: vi.fn(),
      aggregate: vi.fn()
    }
  };
});

// Import the mocked Task model
import Task from '../models/Task';

describe('Task Controllers', () => {
  let req, res;
  
  const mockTask = {
    _id: '60d21b4667d0d8992e610c86',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 'Medium',
    status: 'Pending',
    assignedTo: ['60d21b4667d0d8992e610c85'],
    createdBy: '60d21b4667d0d8992e610c85',
    createdAt: new Date(),
    updatedAt: new Date(),
    save: vi.fn().mockResolvedValue({
      _id: '60d21b4667d0d8992e610c86',
      title: 'Updated Title',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 'Medium',
      status: 'Pending',
      assignedTo: ['60d21b4667d0d8992e610c85'],
      createdBy: '60d21b4667d0d8992e610c85'
    })
  };

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    vi.clearAllMocks();
    
    // Set up default mock returns
    Task.find().populate.mockResolvedValue([mockTask]);
    Task.findById().populate.mockResolvedValue(mockTask);
    Task.create.mockResolvedValue(mockTask);
    Task.findByIdAndDelete.mockResolvedValue(mockTask);
    Task.countDocuments.mockResolvedValue(1);
    Task.aggregate.mockResolvedValue([
      { _id: 'Pending', count: 4 },
      { _id: 'In Progress', count: 3 },
      { _id: 'Completed', count: 3 }
    ]);
    
    // Mock the chained methods for find().sort().limit().select()
    const mockFind = Task.find;
    mockFind.mockReturnValue({
      populate: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue([mockTask])
          })
        })
      })
    });
  });

  describe('getTasks', () => {
    it('should get all tasks for admin user', async () => {
      await getTasks(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        tasks: expect.any(Array),
        statusSummary: expect.any(Object)
      }));
    });

    it('should filter tasks by status', async () => {
      req.query.status = 'Pending';
      
      await getTasks(req, res);

      expect(Task.countDocuments).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should get a task by ID', async () => {
      req.params.id = mockTask._id;
      
      await getTaskById(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(Task.findById).toHaveBeenCalledWith(mockTask._id);
    });

    it('should return 404 if task not found', async () => {
      req.params.id = 'nonexistentid';
      Task.findById().populate.mockResolvedValue(null);
      
      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      req.body = {
        title: 'New Task',
        description: 'New Description',
        dueDate: new Date().toISOString(),
        priority: 'High',
        status: 'Pending',
        assignedTo: ['60d21b4667d0d8992e610c85']
      };
      
      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'created task successfully',
        task: expect.any(Object)
      }));
    });

    it('should return 400 if assignedTo is not an array', async () => {
      req.body = {
        title: 'New Task',
        description: 'New Description',
        dueDate: new Date().toISOString(),
        priority: 'High',
        status: 'Pending',
        assignedTo: 'not-an-array'
      };

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'assigned to must be an array'
      }));
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      req.params.id = mockTask._id;
      req.body = { title: 'Updated Title' };
      
      // Mock findById to return a task with save method
      Task.findById.mockReturnValue(mockTask);
      
      await updateTask(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'task updated'
      }));
    });

    it('should return 404 if task not found', async () => {
      req.params.id = 'nonexistentid';
      req.body = { title: 'Updated Title' };
      
      // Mock findById to return null
      Task.findById.mockReturnValue(null);
      
      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      req.params.id = mockTask._id;
      
      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Deleted Task Successfully',
        task: expect.any(Object)
      }));
    });
  });

  describe('getDashboardData', () => {
    it('should get dashboard data', async () => {
      // Setup the chained methods for find().sort().limit().select()
      Task.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue([mockTask])
          })
        })
      });
      
      await getDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        stats: expect.any(Object),
        charts: expect.any(Object),
        recentTasks: expect.any(Array)
      }));
    });
  });

  describe('getUserDashboardData', () => {
    it('should get user dashboard data', async () => {
      // Setup the chained methods for find().sort().limit().select()
      Task.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue([mockTask])
          })
        })
      });
      
      await getUserDashboardData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        stats: expect.any(Object),
        charts: expect.any(Object),
        recentTasks: expect.any(Array)
      }));
    });
  });
});