import express from 'express';
import workspaceControllers from '../controller/workspace.controllers';
import isAuthenticated from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create/new', isAuthenticated, workspaceControllers.create);

export default router;