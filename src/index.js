import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { uniqBy } from 'lodash';
import userModel from './user.model';


dotenv.config('');

const port = process.env.PORT || 3000;

const models = {
  User: userModel,
};

const typeDefs = `
type User {
  id: ID
  name: String
  email: String!
}

input UserInput {
  name: String
  email: String!
}

type Query {
  hello(name: String): String!
  user: User!
  users: [User]
}

type Mutation {
  hello(name: String!): Boolean!
  createUser(name: String!, email: String!): User!
  createUsers(users: [UserInput!]!): [User]!
}
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    user: () => ({
      name: 'Camilo',
      email: 'camilo@camilo.com'
    }),
    users: async (_, __, ctx) => {
      const { models: { User } } = ctx;

      const users = await User.find();

      return users;
    }
      
  },
  Mutation: {
    hello: (_, { name }) => null,
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
    id: (root) => root.id,
  }
}

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-2aahn.azure.mongodb.net/graphql?retryWrites=true&w=majority`)
  .then((db) => {
    console.log("Connected to DB")
    const server = new GraphQLServer({
      typeDefs,
      resolvers,
      context: {
        models,
        db,
      },
    })
    server.start({ port }, () => console.log('Server is running on localhost:4000'))
  });
