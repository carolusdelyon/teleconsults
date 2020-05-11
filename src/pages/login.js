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

export default function Login() {
    const[warningMessage, setWarningMessage] = useState();
  const client = useApolloClient();
  const [login, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      onCompleted({ login }) {
        if(!login) {
            setWarningMessage('Identificación incorrecta');
            return;
        }
        localStorage.setItem('token', login);
        client.writeData({ data: { isLoggedIn: true } });
      }
    }
  );

  if (loading) return <Loading />;
  if (error) return <p>An error occurred in the login</p>;

  return <LoginForm login={login} warningMessage={warningMessage} />;
}