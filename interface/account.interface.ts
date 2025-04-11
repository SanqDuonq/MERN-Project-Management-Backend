import mongoose from "mongoose";
import { ProviderTypeEnum } from "../enum/account.enum";

export interface IAccount {
    provider: ProviderTypeEnum
    providerId: string
    userId: mongoose.Types.ObjectId
    refreshToken: string
    expireToken: Date
}