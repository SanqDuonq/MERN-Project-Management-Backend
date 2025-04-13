import express from 'express';
import userControllers from '../controller/user.controllers';
import isAuthenticated from '../middleware/auth.middleware';

const router = express.Router();

router.get('/current', isAuthenticated, userControllers.getUser);

export default router;