/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

import App from './App';
import {name as appName} from './app.json';

const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache(),
});

const AppWithApollo = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => AppWithApollo);
