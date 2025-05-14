// tests/userControllers.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockRequest, mockResponse } from '../test-utils';

import { getUsers, getUserById, getSharedTasks } from './userControllers';
import user from '../models/User';
import task from '../models/Task';

// Mock the User and Task models
vi.mock('../models/User');
vi.mock('../models/Task');

describe('User  Controllers', () => {
  let req, res;

  const mockUsers = [
    {
      _id: '60d21b4667d0d8992e610c85',
      name: 'Test User 1',
      email: 'test1@example.com',
      role: 'member'
    },
    {
      _id: '60d21b4667d0d8992e610c86',
      name: 'Test User 2',
      email: 'test2@example.com',
      role: 'member'
    }
  ];

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users with task counts', async () => {
      const selectMock = vi.fn().mockResolvedValue(mockUsers);
user.find.mockReturnValue({ select: selectMock });
      
      task.countDocuments.mockResolvedValueOnce(2) // Pending
        .mockResolvedValueOnce(1) // In Progress
        .mockResolvedValueOnce(3); // Completed

      await getUsers(req, res);

      expect(user.find).toHaveBeenCalledWith({ role: "member" });
      expect(res.json).toHaveBeenCalledWith([
        {
          _id: '60d21b4667d0d8992e610c85',
          name: 'Test User 1',
          email: 'test1@example.com',
          role: 'member',
          pendingTasks: 2,
          InProgressTasks: 1,
          completedTasks: 3
        },
        {
          _id: '60d21b4667d0d8992e610c86',
          name: 'Test User 2',
          email: 'test2@example.com',
          role: 'member',
          pendingTasks: 2,
          InProgressTasks: 1,
          completedTasks: 3
        }
      ]);
    },100000);
  });

  describe('getUser ById', () => {
    it('should return a user by ID', async () => {
      req.params = { id: '60d21b4667d0d8992e610c85' };
      user.findById.mockResolvedValue(mockUsers[0]);

      await getUserById(req, res);

      expect(user.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should return 404 if user not found', async () => {
      req.params = { id: 'nonexistentId' };
      user.findById.mockResolvedValue(null);

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "no user found" });
    });
  });

  describe('getSharedTasks', () => {
    it('should return shared tasks for the user', async () => {
      req.user = { id: '60d21b4667d0d8992e610c85' };
      const mockSharedTasks = [
        {
          taskId: { assignedTo: { name: 'Task Assignee' } },
          sharedBy: { name: 'Sharer', email: 'sharer@example.com' }
        }
      ];
      user.findById.mockResolvedValue({
        sharedTasks: mockSharedTasks,
        populate: vi.fn().mockReturnThis() // Mock populate chaining
      });

      await getSharedTasks(req, res);

      expect(user.findById).toHaveBeenCalledWith(req.user.id);
      expect(res.json).toHaveBeenCalledWith(mockSharedTasks);
    });

    it('should return 404 if user not found', async () => {
      req.user = { id: 'nonexistentId' };
      user.findById.mockResolvedValue(null);

      await getSharedTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User  not found' });
    });
  })
})