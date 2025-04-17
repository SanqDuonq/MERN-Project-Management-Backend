import express from 'express';
import projectControllers from '../controller/project.controllers';
import isAuthenticated from '../middleware/auth.middleware';


const  router = express.Router();

router.post('/workspace/:workspaceId/create', isAuthenticated, projectControllers.createProject);
router.get('/workspace/:workspaceId/all', isAuthenticated, projectControllers.getAllProject)

export default router;