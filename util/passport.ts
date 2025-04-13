import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import appConfig from "../config/app.config";
import { Request } from "express";
import throwError from "./throw-error";
import { ProviderEnum } from "../enum/account.enum";
import authServices from "../service/auth.services";

passport.use(
	new GoogleStrategy(
		{
			clientID: appConfig.GOOGLE_CLIENT_ID!,
			clientSecret: appConfig.GOOGLE_CLIENT_SECRET!,
			callbackURL: appConfig.GOOGLE_CALLBACK_URL,
			scope: ["profile", "email"],
			passReqToCallback: true,
		},
		async (req: Request, accessToken, refreshToken, profile, done) => {
			try {
				const { email, sub: googleId, picture } = profile._json;
				console.log(profile);
				if (!googleId) {
					throwError(404, "GoogleID is missing");
				}
				const { user } = await authServices.createAccountGoogle({
					provider: ProviderEnum.GOOGLE,
					displayName: profile.displayName,
					providerId: googleId,
					picture: picture,
					email: email,
				});
				done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			session: true,
		},
		async (email, password, done) => {
            try {
                const user = await authServices.verifyEmail({email,password});
                return done(null, user!);
            } catch (error:any) {
                return done(error, false, {message: error.message}) 
            }
        }
	)
);


passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
