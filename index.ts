import express from 'express';
import session from 'express-session';
import appConfig from './config/app.config';
import cors from 'cors';
import connectMongoDB from './database/connect-mongo';
import NotFoundRoute from './middleware/not-found-route.middleware';
import errorHandler from './middleware/error-handler.middleware';
import authRoutes from './router/auth.router';
import userRoutes from './router/user.router';
import workspaceRoutes from './router/workspace.router';
import memberRoutes from './router/member.router';
import projectRoutes from './router/project.router';
import taskRoutes from './router/task.router';
import './util/passport';
import passport from 'passport';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(
    session({
        name: 'sessions',
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
app.use('/api/user', userRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/task', taskRoutes);

app.use(NotFoundRoute);
app.use(errorHandler);

app.listen(appConfig.PORT, () => {
    console.log(`App started at http://localhost:${appConfig.PORT}`);
    connectMongoDB();
})
