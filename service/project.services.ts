import mongoose from "mongoose";
import Project from "../model/project.model";
import Task from "../model/task.model";
import throwError from "../util/throw-error";
import { TaskStatusEnum } from "../enum/task.enum";

class ProjectServices {
    async createProject(workspaceId: string, userId: string, data: {
        emoji?: string,
        name: string,
        description?: string
    }) {
        return await Project.create({
            emoji: data.emoji,
            name: data.name,
            description: data.description,
            workspace: workspaceId,
            createdBy: userId
        })
    }

    async getAllProject(workspaceId: string, pageSize: number, pageNumber: number) {
        const totalCount = await Project.countDocuments({
            workspace: workspaceId
        })
        const skip = (pageNumber - 1) * pageSize;
        const project = await Project.find({
            workspace: workspaceId
        })
            .skip(skip)
            .limit(pageSize)
            .populate('createdBy', '_id name profilePicture')
            .sort({ createdAt: -1 })
        const totalPages = Math.ceil(totalCount / pageSize);
        return {
            project, totalCount, totalPages, skip
        }
    }

    async getProjectDetail(workspaceId: string, projectId: string) {
        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        }).select('_id emoji name description');
        if (!project) {
            throwError(404, 'Project not found or does not belong to the specified workspace')
        }
        return {
            project
        }
    }

    async getProjectAnalytics(workspaceId: string, projectId: string) {
        const project = await Project.findById(projectId);
        if (!project || project.workspace.toString() !== workspaceId.toString()) {
            throwError(404, 'Project not found or does not belong to this workspace')
        }
        const currentDate = new Date();
        const taskAnalytics = await Task.aggregate([
            {
                $match: {
                    project: new mongoose.Types.ObjectId(projectId)
                }
            }, 
            {
                $facet: {
                    totalTasks: [{ $count: 'count'}],
                    overdueTasks: [
                        {
                            $match: {
                                dueDate: {$lt: currentDate},
                                status: {
                                    $ne: TaskStatusEnum.DONE
                                }
                            }
                        },
                        {
                            $count: 'count'
                        }
                    ],
                    completedTasks: [
                        {
                            $match: {
                                status: TaskStatusEnum.DONE
                            }
                        },
                        {
                            $count: 'count'
                        }
                    ] 
                }
            }
        ])
        const _analytics = taskAnalytics[0];
        const analytics = {
            totalTasks: _analytics.totalTasks[0]?.count || 0,
            overdueTasks: _analytics.overdueTasks[0]?.count || 0,
            completedTasks: _analytics.completedTasks[0]?.count || 0
        }
        return {
            analytics
        }
    }
}

export default new ProjectServices();