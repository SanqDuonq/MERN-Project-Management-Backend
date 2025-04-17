import { TaskPriorityEnum, TaskStatusEnum } from "../enum/task.enum";
import Member from "../model/member.model";
import Project from "../model/project.model";
import Task from "../model/task.model";
import throwError from "../util/throw-error";

class TaskServices {
    async createTask(workspaceId: string, projectId: string, userId: string, data: { 
        title: string,
        description?: string,
        priority: string,
        status: string,
        assignedTo?: string | null,
        dueDate?: string
    }) {
        const { title, description, priority, status, assignedTo, dueDate } = data;
        const project = await Project.findById(projectId);
        if (!project || project.workspace.toString() !== workspaceId.toString()) {
            throwError(404, 'Project not found or does not belong to this workspace')
        }
        if (assignedTo) {
            const isAssignedUserMember = await Member.exists({
                userId: assignedTo,
                workspaceId
            })
            if (!isAssignedUserMember) {
                throwError(400, 'Assigned user is not a member of this workspace')
            }
        }
        const task = await Task.create({
            title, 
            description, 
            priority: priority || TaskPriorityEnum.MEDIUM, 
            status: status || TaskStatusEnum.TODO,
            assignedTo,
            createdBy: userId,
            workspace: workspaceId,
            project: projectId,
            dueDate
        })
        return {
            task
        }
    }
}

export default new TaskServices();