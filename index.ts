import express from 'express';
import session from 'express-session';
import appConfig from './config/app.config';
import cors from 'cors';
import connectMongoDB from './database/connect-mongo';
import NotFoundRoute from './middleware/not-found-route.middleware';
import errorHandler from './middleware/error-handler.middleware';
import authRoutes from './router/auth.router';
import './util/passport';
import passport from 'passport';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(
    session({
        secret: appConfig.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, 
            secure: appConfig.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax'
        }       
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: appConfig.FRONTEND_ORIGIN,
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use(NotFoundRoute);
app.use(errorHandler);

app.listen(appConfig.PORT, () => {
    console.log(`App started at http://localhost:${appConfig.PORT}`);
    connectMongoDB();
})
