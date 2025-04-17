import Project from "../model/project.model";

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
}

export default new ProjectServices();