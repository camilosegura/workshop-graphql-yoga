import { uniqBy } from 'lodash';
import { idResolver } from '../utils';

const resolvers = {
  Query: {
    users: async (_, __, ctx) => {
      const { models: { User } } = ctx;

      const users = await User.find();

      return users;
    },
  },
  Mutation: {
    createUser: async (_, args, ctx) => {
      const { email } = args;
      const { models: { User } } = ctx;
      const userExist = await User.exists({ email });

      if (userExist) {
        throw new Error('The user already exist');
      }

      const user = await User.create(args);

      return user;
    },
    createUsers: async (_, args, ctx) => {
      const { users } = args;
      const { models: { User } } = ctx;

      if (!users.length) {
        throw new Error('There is not users');
      }

      const uniqsArray = uniqBy(users, 'email');

      if (uniqsArray.length !== users.length) {
        throw new Error('The email is repeated');
      }

      const emails = users.map(user => user.email);
      const userExist = await User.exists({ email: { $in: emails } });

      if (userExist) {
        throw new Error('The user already exist');
      }

      const newUsers = await User.create(users);

      return newUsers;
    },
  },
  User: {
    id: idResolver,
    projects: async ({ id }, _, ctx) => {
      const { loaders: { projects } } = ctx;
      
      return projects.load(id);;
    },
  },
}

export default resolvers;
