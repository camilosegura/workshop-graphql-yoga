import { idResolver } from '../utils';

const resolvers = {
  Query: {
    projects: async (_, __, ctx) => {
      const { models: { Project } } = ctx;

      const projects = await Project.find();

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
  },
  Project: {
    id: idResolver,
  }
}

export default resolvers;
