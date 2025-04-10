import express from 'express';
import session from 'cookie-session';
import appConfig from './config/app.config';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(
    session({
        name: 'Sessions',
        keys: [appConfig.SESSION_SECRET!],
        maxAge: 1000 * 60 * 60 * 24, 
        secure: appConfig.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    })
);
app.use(cors({
    origin: appConfig.FRONTEND_ORIGIN,
    credentials: true
}));

app.listen(appConfig.PORT, () => {
    console.log(`App started at http://localhost:${appConfig.PORT}`);
})
