import mongoose, { Schema } from "mongoose";
import { IRole } from "../interface/role.interface";
import { Permissions, RoleEnum } from "../enum/role.enum";
import { RolePermission } from "../utils/role-permission";

const RoleSchema = new Schema<IRole>({
    name: {
        type: String,
        enum: Object.values(RoleEnum),
        required: true,
        unique: true
    },
    permissions: {
        type: [String],
        enum: Object.values(Permissions),
        required: true,
        default: function (this: IRole) {
            return RolePermission[this.name];
        }
    }
}, {collection: 'Role', timestamps: true});

const Role = mongoose.model('Role', RoleSchema);
export default Role;