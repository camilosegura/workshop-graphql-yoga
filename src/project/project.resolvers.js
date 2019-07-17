import { idResolver } from '../utils';

const resolvers = {
  Query: {
    projects: async (_, __, ctx) => {
      const { models: { Project } } = ctx;

      const projects = await Project.find().populate('users');

      return projects;
    },
  },
  Mutation: {
    createProject: async (_, args, ctx) => {
      const { project } = args;
      const { models: { Project } } = ctx;

      const newProject = await Project.create(project);

      return newProject;
    },
    addUserToProject: async (_, args, ctx) => {
      const { projectId, userId } = args;
      const { models: { Project, User } } = ctx;

      const userExist = User.exists({ _id: userId });      

      if (!userExist) {
        throw new Error(`User with id ${userId} does not exists`);
      }

      const projectToAdd = await Project.findById(projectId);

      if (!projectToAdd) {
        throw new Error(`Project with id ${projectId} does not exist`)
      }

      projectToAdd.users.push(userId);

      await projectToAdd.save();

      return await Project
        .findById(projectId)
        .populate('users');
    },
  },
  Project: {
    id: idResolver,
  }
}

export default resolvers;
