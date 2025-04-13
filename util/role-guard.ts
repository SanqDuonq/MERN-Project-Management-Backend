import { PermissionsTypeEnum } from "../enum/role.enum";
import { RolePermission } from "./role-permission";
import throwError from "./throw-error";

export const roleGuard = (
    role: keyof typeof RolePermission, 
    requiredPermission: PermissionsTypeEnum[]
) => {
    const permissions = RolePermission[role];
    const hasPermission = requiredPermission.every((permission) => permissions.includes(permission));
    if (!hasPermission) {
        throwError(401, 'You do not have the necessary permission to perform actions');
    }
}