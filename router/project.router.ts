import express from 'express';
import projectControllers from '../controller/project.controllers';
import isAuthenticated from '../middleware/auth.middleware';


const  router = express.Router();

router.post('/workspace/:workspaceId/create', isAuthenticated, projectControllers.createProject);

export default router;