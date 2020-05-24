import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { CONSULT_DATA_FRAGMENT } from "../pages/consult";
import { ConsultTile } from '../pages/consults';
import { colors } from '../styles';
import Loading from './loading';

export const MY_CONSULTS = gql`
query myConsults {
  me {
      id,
      name,
      roles,
    pendent: consults(state: PENDENT) {
        ...ConsultData
    }
    answered: consults(state: ANSWERED) {
        ...ConsultData
    }
  }
}
${CONSULT_DATA_FRAGMENT}
`;

export default function ConsultEspecialist() {
    const {
        data: dataConsults,
        loading,
        error
    } = useQuery(MY_CONSULTS, { fetchPolicy: "network-only" });

    if (loading) return <Loading />;
    if (error || !dataConsults) console.log('Error getting consults in consultSpecialist.js :( ===> '+ error);

    // setting chart bar data
    let countPendent = dataConsults.me ? dataConsults.me.pendent.length : 0;
    let countAnswered = dataConsults.me ? dataConsults.me.answered.length : 0;
    const dataChart = [{ name: 'Pendientes', count: countPendent }, { name: 'Contestadas', count: countAnswered }];

    return (
        <div>
            <BarChart width={document.body.clientWidth * 0.8} height={150} data={dataChart}>
                <Bar fill={colors.quaternary} dataKey="count" label={{ position: 'inside' }} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} hide={true} domain={[0, 'dataMax']} />
            </BarChart>
            <h2>Consultas Pendientes <span className="material-icons">new_releases</span></h2>
            <ul>
                {dataConsults.me && dataConsults.me.pendent.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} />
                ))}
            </ul>
            {dataConsults.me && dataConsults.me.pendent.length === 0 && <p>No tiene consultas pendientes.</p>}
            <h2>Consultas Contestadas</h2>
            <ul>
                {dataConsults.me && dataConsults.me.answered.map((consult, index) => (
                    <ConsultTile consult={consult} key={index} />
                ))}
            </ul>
            {dataConsults.me && dataConsults.me.answered.length === 0 && <p>No tiene consultas contestadas.</p>}
        </div>
    );
}