import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  models,
  typeDefs,
  resolvers,
} from './graphql';

dotenv.config('');

const port = process.env.PORT || 4000;

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
