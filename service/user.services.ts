import User from "../model/user.model";
import throwError from "../util/throw-error";

class UserServices {
    private async checkUser(userId: string) {
        if (!await User.findById(userId)) {
            throwError(404, 'User not found');
        }
    }

    async getUser(userId: string) {
        await this.checkUser(userId);
        const user = await User.findById(userId)
            .populate('currentWorkspace')
            .select('-password')
        return {user};
    }
}

export default new UserServices();