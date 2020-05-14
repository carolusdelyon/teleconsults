import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';

const LogoutButton = (props) => {
  const client = useApolloClient();
  return (
    <div
      onClick={() => {
        client.writeData({ data: { isLoggedIn: false } });
        // TODO: to preserve the autosave forms
        localStorage.clear();
      }}
    >
      {props.children}
    </div>
  );
}

export default LogoutButton;