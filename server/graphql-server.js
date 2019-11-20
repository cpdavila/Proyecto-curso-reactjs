import http from "http";
import express from "express";
import typeDefs from "./db/schema";
import resolvers from "./db/resolvers";
import db from "./db/models";
import { ApolloServer, ApolloError, gql } from "apollo-server-express";
import jwt from "jsonwebtoken";
import utils from "./utils";

const PORT = 3001;

export const getUser = token => {
  let currentToken = token;
  if (currentToken.startsWith("Bearer ")) {
    // Remove Bearer from string
    currentToken = currentToken.slice(7, currentToken.length);
  }
  if (currentToken) {
    try {
      const decoded = jwt.verify(currentToken, utils.JWT_SECRET);
      return decoded;
    } catch (err) {
      throw new ApolloError(
        "There was an error reading the authentication header. Please authenticate again."
      );
    }
  }
  return null;
};

const app = express();
const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  context: ({ req }) => {
    const token = (req && req.headers.authorization) || "";
    const user = getUser(token);
    return { db, user };
  }
});
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Inicia la app
httpServer.listen(PORT, error => {
  if (error) {
    return console.log("Ocurrió un error", error);
  }

  console.log(`Escuchando en http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `Subscripciones en ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
