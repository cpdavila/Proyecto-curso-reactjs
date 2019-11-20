import { ApolloError, PubSub } from 'apollo-server-express';

const pubSub = new PubSub();
const MESSAGE_CREATED = 'MESSAGE_CREATED';
const MESSAGE_APPROVED = 'MESSAGE_APPROVED';
const MESSAGE_REJECTED = 'MESSAGE_REJECTED';

export default {
  Query: {
    messages: (parent, args, { db }) => db.message.findAll(),
    approvedMessages: (parent, args, {db}) => db.message.findAll(),
  },
  Mutation: {
    createMessage: async (parent, { content }, { db }) => {
      if (content) {
        const message = await db.message.create({content});
        pubSub.publish(MESSAGE_CREATED, {messageCreated: {id: message.id, content, approved: false}});
        return message;
      }
      throw new ApolloError('Ocurrió un error al crear un mensaje');
    },
    approveMessage: async (parent, { id }, { db }) => {
      if (id) {
        const message = await db.message.findByPk(id);
        if (message) {
          message.update({approved: true});
          pubSub.publish(MESSAGE_APPROVED, {messageApproved: {id: message.id, content: message.content, approved: true}});
        }
        return message;
      }
      throw new ApolloError('Ocurrió un error al aprobar un mensaje');
    },
    rejectMessage: async (parent, { id }, { db }) => {
      if (id) {
        const message = await db.message.findByPk(id);
        if (message) {
          message.update({approved: false});
          pubSub.publish(MESSAGE_REJECTED, {messageRejected: {id: message.id, content: message.content, approved: false}});
        }
        return message;
      }
      throw new ApolloError('Ocurrió un error al rechazar un mensaje');
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubSub.asyncIterator([MESSAGE_CREATED]),
    },
    messageApproved: {
      subscribe: () => pubSub.asyncIterator([MESSAGE_APPROVED]),
    },
    messageRejected: {
      subscribe: () => pubSub.asyncIterator([MESSAGE_REJECTED]),
    },
  },
};
