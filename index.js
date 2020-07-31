'use strict';
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInputObjectType
} = require('graphql');

const {nodeInterface} = require('./src/node.js');

const {getVideoById, getVideos, createVideo} = require('./src/data/index.js');

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video on Egghead.io',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: 'The id of the video.'
    },  
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video (in seconds).',
    },
    released: {
      type: GraphQLBoolean,
      description: 'Whether or not the viewer has watched the video.'
    },
  },
  interfaces: [nodeInterface],
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    videos: {
      type: GraphQLList(videoType),
      resolve: () => {
        return getVideos()
      }
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video'
        }
      },
      resolve: (_, args) => {
        return getVideoById(args.id)
      }
    },
  },
});

const videoInputType = new GraphQLInputObjectType({
  name: "VideoInput",
  description: 'new video input args',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video.',
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video (in seconds).',
    },
    released: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Whether or not the video is released.',
    },
  }
})

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type.',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType),
        }
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }  
    }
  }
});

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
}); 


server.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
  })
);

// const resolvers = {
//   video: () => ({
//     id: 1,
//     title: "how to speak like a pro",
//     duration: 20, 
//     watched: true
//   }),
//   videos: videos
// }

// server.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: true,
//   rootValue: resolvers,
//   })

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
})