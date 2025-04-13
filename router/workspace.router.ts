import express from 'express';
import workspaceControllers from '../controller/workspace.controllers';
import isAuthenticated from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create/new', isAuthenticated, workspaceControllers.createWorkspace);
router.get('/all', isAuthenticated, workspaceControllers.getAllWorkspace);
router.get('/:id', workspaceControllers.getWorkspaceById)


export default router;