import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import userModel from './user/user.model';
import projectModel from './project/project.model';
import projectLoader from './project/project.loader';

const models = {
  User: userModel,
  Project: projectModel,
};

const loaders = {
  projects: projectLoader(),
};

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, './**/*.graphql'), { recursive: true }),
  { all: true }
);

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './**/*.resolvers.js'))
);

export {
  models,
  typeDefs,
  resolvers,
  loaders,
}
