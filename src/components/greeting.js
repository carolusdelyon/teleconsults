import React from "react";
import { useQuery } from '@apollo/react-hooks';

import { ME } from '../pages/profile';
import Loading from './loading';

const Greeting = ({name}) => {
    const {
        data,
        loading,
        error
    } = useQuery(ME);

    if (loading) return <Loading />;
    if (error || !data) return <p>Error getting user data :(</p>;

    const hour = new Date().getHours();

    return (
        <>
        <p>{(hour < 12 ? 'Buenos días '
            : hour < 18 ? 'Buenas tardes '
                : 'Buenas noches ') + name}</p>
        </>
    );
}

export default Greeting;