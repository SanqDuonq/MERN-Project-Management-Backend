import { PermissionsTypeEnum, RoleTypeEnum } from "../enum/role.enum";

export interface IRole {
    name: RoleTypeEnum,
    permissions: Array<PermissionsTypeEnum>
}