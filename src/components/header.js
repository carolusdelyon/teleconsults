import React from 'react';

const Header = ({ headerText = 'Telemedicina Cayapas' }) => {
    const username = atob(localStorage.getItem('token'));

    return (
        <header>
            <h1>{ headerText }</h1>
        </header>
    );
}

export default Header;