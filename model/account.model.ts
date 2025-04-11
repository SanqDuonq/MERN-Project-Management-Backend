import mongoose, { Schema } from "mongoose";
import { IAccount } from "../interface/account.interface";
import { ProviderEnum } from "../enum/account.enum";

const AccountSchema = new Schema<IAccount>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    provider: {
        type: String,
        enum: Object.values(ProviderEnum),
        required: true
    },
    providerId: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    expireToken: {
        type: Date,
        default: null
    }
}, {collection: 'Account', timestamps: true, toJSON: {transform(doc, ret) {
    delete ret.refreshToken
}}});

const Account = mongoose.model('Account', AccountSchema);
export default Account;