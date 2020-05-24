import { useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ME } from '../pages/profile';
import { colors } from '../styles';
import Loading from './loading';


const style = css`
    color: ${colors.quaternary};
    padding: 1em;
    text-transform: capitalize;
`;

const Greeting = ({ name }) => {
    const {
        data,
        loading,
        error
    } = useQuery(ME);

    if (loading) return <Loading />;
    if (error || !data) return <p>Error consultando los datos del usuario :(</p>;

    const hour = new Date().getHours();

    return (
        <h4 css={style}>{(hour < 12 ? 'Buenos días '
            : hour < 18 ? 'Buenas tardes '
                : 'Buenas noches ')}
            <span>{name.split(' ')[0].toLowerCase()}</span>
        </h4>
    );
}

export default Greeting;