
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split, concat } from 'apollo-link';

import { getToken } from '../services/auth';


const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3001/graphql',
  options: {
    reconnect: true,
  },
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getToken();
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }
  return forward(operation);
});

const link = split(({query}) => {
  const definition = getMainDefinition(query);
  return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
}, wsLink, httpLink);

const client = new ApolloClient({
  link: concat(authLink, ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.log(`[GraphQL error]: Message ${message}, Location: ${locations}, Path: ${path}`);
        });
      }
      if (networkError) {
        console.log('[Network error]', networkError);
      }
    }),
    link,
  ])),
  cache: new InMemoryCache(),
});

export default client;