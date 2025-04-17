import express from 'express';
import projectControllers from '../controller/project.controllers';
import isAuthenticated from '../middleware/auth.middleware';

const  router = express.Router();

router.post('/workspace/:workspaceId/create', isAuthenticated, projectControllers.createProject);
router.get('/workspace/:workspaceId/all', isAuthenticated, projectControllers.getAllProject);
router.get('/:id/workspace/:workspaceId', isAuthenticated, projectControllers.getProjectDetail);
router.get('/:id/workspace/:workspaceId/analytics', isAuthenticated, projectControllers.getProjectAnalytics);
router.put('/:id/workspace/:workspaceId/update', isAuthenticated, projectControllers.updateProject);
router.delete('/:id/workspace/:workspaceId/delete', isAuthenticated, projectControllers.deleteProject);

export default router;