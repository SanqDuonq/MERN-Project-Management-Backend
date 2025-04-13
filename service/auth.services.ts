import mongoose from "mongoose";
import { IGoogle } from "../interface/auth.interface";
import User from "../model/user.model";
import Account from "../model/account.model";
import Workspace from "../model/workspace.model";
import Role from "../model/role-permission.model";
import { RoleEnum } from "../enum/role.enum";
import throwError from "../util/throw-error";
import Member from "../model/member.model";
import { ProviderEnum } from "../enum/account.enum";
import session from "express-session";
import bcryptjs from "../util/bcryptjs";

class AuthServices {
	createAccountGoogle = async (data: IGoogle) => {
		const { providerId, provider, displayName, email, picture } = data;
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			console.log("Started session...");
			let user = await User.findOne({ email }).session(session);
			if (!user) {
				// Create a new user if it doesn't exist
				user = new User({
					email,
					name: displayName,
					profilePicture: picture,
				});
				await user.save({ session });
				const account = new Account({
					userId: user._id,
					provider: provider,
					providerId: providerId,
				});
				await account.save({ session });
				// Create a new workspace for new user
				const workspace = new Workspace({
					name: `My Workspace`,
					description: `Workspace created for ${user.name}`,
					owner: user._id,
				});
				await workspace.save({ session });

				const ownerRole = await Role.findOne({
					name: RoleEnum.OWNER,
				}).session(session);
				if (!ownerRole) {
					throwError(404, "Owner role not found");
				}

				const member = new Member({
					userId: user._id,
					workspaceId: workspace._id,
					role: ownerRole!._id,
					joinAt: new Date(),
				});
				await member.save({ session });
				user.currentWorkspace =
					workspace._id as mongoose.Types.ObjectId;
				await user.save({ session });
			}
			await session.commitTransaction();
			session.endSession();
			console.log("End session...");
			return { user };
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		} finally {
			session.endSession();
		}
	};

	registerUser = async (data: {
		email: string;
		name: string;
		password: string;
	}) => {
		const { email, name, password } = data;
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			const existUser = await User.findOne({ email }).session(session);
			if (existUser) {
				throwError(409, "Email already exist");
			}
			const hashPassword = await bcryptjs.hashPassword(password);
			const user = new User({
				email,
				password: hashPassword,
				name,
			});
			await user.save({ session });

			const account = new Account({
				userId: user._id,
				provider: ProviderEnum.EMAIL,
				providerId: email,
			});
			await account.save({ session });

			const workspace = new Workspace({
				name: `My Workspace`,
				description: `Workspace created for ${user.name}`,
				owner: user._id,
			});
			await workspace.save({ session });

			const ownerRole = await Role.findOne({
				name: RoleEnum.OWNER,
			}).session(session);
			if (!ownerRole) {
				throwError(404, "Owner role not found");
			}

			const member = new Member({
				userId: user._id,
				workspaceId: workspace._id,
				role: ownerRole!._id,
				joinAt: new Date(),
			});
			await member.save({ session });
			user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
			await user.save({ session });

			await session.commitTransaction();
			session.endSession();
			console.log("End session...");
			return { userId: user._id, workspaceId: workspace._id };
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
			throw error;
		}
	};

	verifyEmail = async ({
		email,
		password,
		provider = ProviderEnum.EMAIL,
	}: {
		email: string;
		password: string;
		provider?: string;
	}) => {
        const user = await User.findOne({email}).select('+password')
        if (!user) {
            throwError(404, 'Email not found');
        }
		const isMatch = await bcryptjs.comparePassword(password, String(user!.password));
        if (!isMatch) {
            throwError(400, 'Invalid email or password')
        }
        const account = await Account.findOne({provider, providerId: email})
        if (!account) {
            throwError(400, 'Invalid email or password')
        }
        return user;
    };
}

export default new AuthServices();
