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
}

export default new ProjectServices();