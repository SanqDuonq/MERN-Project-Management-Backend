import express from 'express';
import isAuthenticated from '../middleware/auth.middleware';
import taskControllers from '../controller/task.controllers';

const router = express.Router();

router.post('/projects/:projectId/workspace/:workspaceId/create', isAuthenticated, taskControllers.createTask);
router.put('/:id/projects/:projectId/workspace/:workspaceId/update', isAuthenticated, taskControllers.updateTask);
router.get('/workspace/:workspaceId/all', isAuthenticated, taskControllers.getAllTask)

export default router;