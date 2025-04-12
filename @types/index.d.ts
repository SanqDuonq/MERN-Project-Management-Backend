import { IUser } from '../interface/user.interface';
declare global {
    namespace Express {
        interface User extends IUser {
            _id?: any;
        }
    }
}