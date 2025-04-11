import { Permissions, PermissionsTypeEnum, RoleTypeEnum } from "../enum/role.enum";

export const RolePermission: Record<RoleTypeEnum, Array<PermissionsTypeEnum>> = {
    OWNER: [
        Permissions.CREATE_WORKSPACE,
        Permissions.EDIT_WORKSPACE,  
        Permissions.DELETE_WORKSPACE,
        Permissions.MANAGE_WORKSPACE_SETTINGS,

        Permissions.ADD_MEMBER,
        Permissions.CHANGE_MEMBER_ROLE,
        Permissions.REMOVE_MEMBER,

        Permissions.CREATE_PROJECT,
        Permissions.EDIT_PROJECT,
        Permissions.DELETE_PROJECT,

        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.DELETE_TASK,

        Permissions.VIEW_ONLY,
    ],
    ADMIN: [
        Permissions.ADD_MEMBER,

        Permissions.CREATE_PROJECT,
        Permissions.EDIT_PROJECT,
        Permissions.DELETE_PROJECT,

        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.DELETE_TASK,

        Permissions.MANAGE_WORKSPACE_SETTINGS,
        Permissions.VIEW_ONLY,
    ],
    MEMBER: [
        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.VIEW_ONLY,
    ]
}