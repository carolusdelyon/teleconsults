import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

const LogoutButton = () => {
  const client = useApolloClient();
  return (
    <button
      onClick={() => {
        client.writeData({ data: { isLoggedIn: false } });
        // localStorage.clear();
        // to preserve the autosave forms
        localStorage.setItem('token', undefined);
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;