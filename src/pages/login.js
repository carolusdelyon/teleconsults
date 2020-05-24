import React, { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Loading from '../components/loading';
import LoginForm from '../components/loginForm';

export const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export default function Login({ refetchLoggedIn }) {
  const [warningMessage, setWarningMessage] = useState();
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted({ login }) {
        if (!login) {
          setWarningMessage('Identificación incorrecta');
          return;
        }
        localStorage.setItem('token', login);
        client.writeData({ data: { isLoggedIn: true } });

        /** This is a dirty workaround to solve the not
        * automatic update of the token in the local 
        * storage. // remove
        * 
        * TODO: fix this as soon as possible
        **/
        window && window.location.reload();
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>Error en Login</p>;

  return <LoginForm login={login} warningMessage={warningMessage} />;
}