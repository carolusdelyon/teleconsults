import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { Global } from '@emotion/core';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import gql from 'graphql-tag';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import Login from './pages/login';
import { resolvers, typeDefs } from './resolvers';
import { global } from './styles';

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: new createUploadLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
      'client-name': 'Teleconsults',
      'client-version': '1.0.0',
    },
  }),
  resolvers,
  typeDefs,
});

// Default values
// Token will already exist if we have logged in before
cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
  },
});
// init the autosave storage; if it doesn't exist yet
if (!localStorage.getItem('autosave')) {
  localStorage.setItem('autosave', '{}');
}

/**
 * Render our app
 * - We wrap the whole app with ApolloProvider, so any component in the app can
 *    make GraphqL requests. Our provider needs the client we created above,
 *    so we pass it as a prop
 * - We need a router, so we can navigate the app. We're using React router for this.
 */

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

ReactDOM.render(
  <React.StrictMode>
    <Global
      styles={global}
    />
    <ApolloProvider client={client}>
      <IsLoggedIn />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
