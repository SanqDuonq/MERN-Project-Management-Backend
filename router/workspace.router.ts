import express from 'express';
import workspaceControllers from '../controller/workspace.controllers';
import isAuthenticated from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create/new', isAuthenticated, workspaceControllers.createWorkspace);
router.get('/all', isAuthenticated, workspaceControllers.getAllWorkspace);
router.get('/:id', isAuthenticated, workspaceControllers.getWorkspaceById);
router.get('/member/:id', isAuthenticated, workspaceControllers.getWorkspaceMember);


export default router;