import { useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ConsultsCoordinator from '../components/consultsCoordinator';
import ConsultSpecialist from '../components/consultsSpecialist';
import Greeting from '../components/greeting';
import Loading from '../components/loading';
import { breakpoints, colors } from '../styles';
import Consult from './consult';
import { ME } from './profile';

const style = css`
    &>div{
        margin-top: 1em;
        margin-bottom: 3em;
    }

    h2{
        margin: 0.5em 0;
        margin-top: 2em;
    }
    h2>.material-icons{
        color: ${colors.warning};
    }

    /* bar chart */
    .recharts-wrapper{
        margin: 1em auto;
    }
    .recharts-bar text{
        stroke: ${colors.textLight};
        fill: ${colors.textLight};
    }
    .recharts-surface{
        max-width: ${breakpoints[2]}px;
        max-height: 300px;
    }
`;

export default function Consults() {
    let match = useRouteMatch();

    const {
        data: dataMe,
        loading: loadingMe,
        error: errorMe
    } = useQuery(ME);
    if (loadingMe || !dataMe.me) return <Loading />;
    if (errorMe || !dataMe) return <p>Error obteniendo los datos del usuario :(</p>;

    return (
        <div css={style}>
            <Switch>
                <Route path={`${match.path}/:consultId`}>
                    <Consult />
                </Route>
                <Route path={`${match.path}`}>
                    <Greeting name={dataMe.me.name} />
                    {dataMe.me.roles.includes('SPECIALIST') &&
                        <ConsultSpecialist />}
                    {dataMe.me.roles.includes('COORDINATOR') &&
                        <ConsultsCoordinator />
                    }
                </Route>
            </Switch>
        </div>
    );
}