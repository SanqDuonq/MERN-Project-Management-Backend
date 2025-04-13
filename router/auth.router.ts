import express from 'express';
import passport from 'passport';
import appConfig from '../config/app.config';
import authControllers from '../controller/auth.controllers';

const failedUrl = `${appConfig.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`

const router = express.Router();

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {failureRedirect: failedUrl,}), authControllers.googleCallback);

router.post('/register', authControllers.registerUser);
router.post('/login', authControllers.loginUser);

export default router;