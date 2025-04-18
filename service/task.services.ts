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

    async updateTask(workspaceId: string, projectId: string, taskId: string, data: {
        title: string,
        description?: string,
        priority: string,
        status: string,
        assignedTo?: string | null,
        dueDate?: string
    }) {
        const project = await Project.findById(projectId); 
        if (!project || project.workspace.toString() !== workspaceId.toString()) {
            throwError(404, 'Project not found or does not belong to this workspace')
        }
        const task = await Task.findById(taskId);
        if (!task || task.project.toString() !== projectId.toString()) {
            throwError(404, 'Task not found or does not belong to this project')
        }
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
            ...data
        }, {new: true})
        if (!updatedTask) {
            throwError(404, 'Failed to update task')
        }
        return {
            task: updatedTask
        }
    }

    async getAllTask(workspaceId: string, filter: {
        projectId?: string,
        status?: string[],
        priority?: string[],
        assignedTo?: string[],
        keyword?: string,
        dueDate?: string
    }, 
    pagination: {
        pageSize: number,
        pageNumber: number
    }) {
        const query: Record<string, any> = {
            workspace: workspaceId
        }
        if (filter.projectId) {
            query.project = filter.projectId
        }
        if (filter.status) {
            query.status = {$in: filter.status}
        }
        if (filter.priority) {
            query.priority = {$in: filter.priority}
        }
        if (filter.assignedTo && filter.assignedTo.length > 0) {
            query.assignedTo = {$in: filter.assignedTo}
        }
        if (filter.keyword && filter.keyword !== undefined) {
            query.title = {$regex: filter.keyword, $options: 'i'}
        }
        if (filter.dueDate) {
            query.dueDate = {$eq: new Date(filter.dueDate)}
        }
        const {pageSize, pageNumber} = pagination;
        const skip = (pageNumber - 1) * pageSize;
        const [tasks, totalCount] = await Promise.all([
            Task.find(query) 
                .skip(skip)
                .limit(pageSize)
                .sort({createdAt: -1})
                .populate('assignedTo', '_id name profilePicture')
                .populate('project', '_id emoji name'),
            Task.countDocuments(query)
        ])
        const totalPages = Math.ceil(totalCount / pageSize);
        return {
            tasks, 
            pagination: {
                pageSize,
                pageNumber,
                totalCount,
                totalPages,
                skip
            }
        }
    }

    async getDetailTask(workspaceId: string, projectId: string, taskId: string) {
        const project = await Project.findById(projectId);
        if (!project || project.workspace.toString() !== workspaceId.toString()) {
            throwError(404, 'Project not found or does not belong to this workspace')
        }
        const task = await Task.findOne({
            _id: taskId,
            workspace: workspaceId,
            project: projectId
        }).populate('assignedTo', '_id name profilePicture')
        if (!task) {
            throwError(404, 'Task not found')
        }
        return task;
    }

    async deleteTask(workspaceId: string, taskId: string) {
        const task = await Task.findOneAndDelete({
            _id: taskId,
            workspace: workspaceId
        });
        if (!task) {
            throwError(404, 'Task not found or does not belong to the specified workspace')
        }
        return;
    }
}

export default new TaskServices();