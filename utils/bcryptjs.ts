import bcryptjs from 'bcryptjs';

class Bcrypt {
    hashPassword = async (password: string) => {
        return await bcryptjs.hash(password, 10);
    }

    comparePassword = async (password: string, hashPassword: string) => {
        return await bcryptjs.compare(password, hashPassword);
    }
}

export default new Bcrypt();