import express from 'express';
import memberControllers from '../controller/member.controllers';
import isAuthenticated from '../middleware/auth.middleware';

const router = express.Router();

router.post('/workspace/:invitedCode/join',isAuthenticated, memberControllers.joinWorkspace);

export default router;