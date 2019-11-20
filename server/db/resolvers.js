import { ApolloError, PubSub } from "apollo-server-express";
import { FaAlignJustify } from "react-icons/fa";
import jwt from "jsonwebtoken";

import utils from "../utils";
const pubSub = new PubSub();
const MESSAGE_CREATED = "MESSAGE_CREATED";
const MESSAGE_APPROVED = "MESSAGE_APPROVED";
const MESSAGE_REJECTED = "MESSAGE_REJECTED";

export default {
  Query: {
    messages: (parent, args, { db }) => db.message.findAll(),
    messagesStatus: (parent, args, { db }) =>
      db.message.findAll({
        where: {
          approved: args.status
        }
      }),
    approvedMessages: (parent, args, { db }) =>
      db.message.findAll({
        where: {
          approved: true
        },
        order: [["updatedAt", "DESC"]]
      })
  },
  Mutation: {
    signIn: (parent, { username, password }, { db }) => {
      if (username === "admin" && password === "admin") {
        return jwt.sign({ role: "admin" }, utils.JWT_SECRET, {
          expiresIn: "12h"
        });
      }
      throw new ApolloError("Ocurrio un error");
    },
    createMessage: async (parent, { content }, { db }) => {
      if (content) {
        const message = await db.message.create({ content });
        pubSub.publish(MESSAGE_CREATED, {
          messageCreated: { id: message.id, content, approved: false }
        });
        return message;
      }
      throw new ApolloError("Ocurrió un error al crear un mensaje");
    },
    approveMessage: async (parent, { id }, { db }) => {
      if (id && user && user.role === "admin") {
        const message = await db.message.findByPk(id);
        if (message) {
          message.update({ approved: true });
          pubSub.publish(MESSAGE_APPROVED, {
            messageApproved: {
              id: message.id,
              content: message.content,
              approved: true
            }
          });
        }
        return message;
      }
      throw new ApolloError("Ocurrió un error al aprobar un mensaje");
    },
    rejectMessage: async (parent, { id }, { db }) => {
      if (id && user && user.role === "admin") {
        const message = await db.message.findByPk(id);
        if (message) {
          message.update({ approved: false });
          pubSub.publish(MESSAGE_REJECTED, {
            messageRejected: {
              id: message.id,
              content: message.content,
              approved: false
            }
          });
        }
        return message;
      }
      throw new ApolloError("Ocurrió un error al rechazar un mensaje");
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubSub.asyncIterator([MESSAGE_CREATED])
    },
    messageApproved: {
      subscribe: () => pubSub.asyncIterator([MESSAGE_APPROVED])
    },
    messageRejected: {
      subscribe: () => pubSub.asyncIterator([MESSAGE_REJECTED])
    }
  }
};
