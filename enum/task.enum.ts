export const TaskStatusEnum = {
    BACKLOG: 'BACKLOG',
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    IN_REVIEW: 'IN_REVIEW',
    DONE: 'DONE'
} as const

export const TaskPriorityEnum = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
} as const

export type TaskStatusTypeEnum = keyof typeof TaskStatusEnum;
export type TaskPriorityTypeEnum = keyof typeof TaskPriorityEnum;