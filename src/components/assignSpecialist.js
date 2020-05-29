import { useMutation, useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import gql from 'graphql-tag';
import { useState } from "react";
import DataList from './datalist';
import Loading from './loading';

const style = css`
    button, input, label{
        display: block;
    }
    button, input{
        margin: 0.5em auto;
    }
    label{
        font-weight: 700;
    }
`;

export const GET_SPECIALISTS = gql`
query getSpecialists($speciality: String) {
    specialists(speciality: $speciality) {
        name
        username
        id
  }
}`

export const SET_SPECIALIST = gql`
mutation setSpecialist($specialistId: ID!, $consultId: ID!){
    assignSpecialist(specialistId:$specialistId, consultId: $consultId){
        success
        message
    }
}
`;

function Assign({ speciality, consultId }) {
    // state to control specialistId selected
    const [specialistName, setSpecialistName] = useState(null);

    // mutation to assign an specialist to a consult
    const [setSpecialist, { loading: loadingSetSpecilist, error: errorSetSpecilist }] = useMutation(
        SET_SPECIALIST,
        {
            onCompleted(returnData) {
                console.log(returnData); //remove
                alert(returnData.assignSpecialist.message);
                window.location.href = '/';
            }
        }
    );

    // searching specialists with corresponding speciality
    const {
        data: dataSpecialists,
        loading: loadingSpecialists,
        error: errorSpecialists
    } = useQuery(GET_SPECIALISTS, {
        variables: { speciality }
    });

    if (loadingSetSpecilist) return <Loading />;
    if (errorSetSpecilist) return <p>Error al asignar el especialista :(</p>;
    if (loadingSpecialists) return <Loading />;
    if (errorSpecialists || !dataSpecialists) return <p>Error buscando los datos de los especialistas :(</p>;

    function submitSetSpecialist() {
        const specialist = dataSpecialists.specialists.filter(specialist => specialist.name === specialistName)[0];
        setSpecialist({
            variables: {
                specialistId: specialist.id,
                consultId
            }
        });
    }

    return (
        <div css={style}>
            <label htmlFor="specialistList">Especialista a asignar</label>
            <DataList name="specialistList"
                onInput={({ target }) => setSpecialistName(target.value)}>
                {dataSpecialists.specialists.map((specialist, index) => (
                    <option key={index} value={specialist.name}>{specialist.id}</option>
                ))}
            </DataList>
            <button onClick={submitSetSpecialist}>Asignar</button>
        </div>
    );
}

export default Assign;