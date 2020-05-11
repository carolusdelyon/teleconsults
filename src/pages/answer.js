import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import AnswerForm from '../components/answerForm';
import {ME} from './profile';

// setInfoForm('Se cargó un formulario guardado.');
// setInfoForm('Este formulario se guarda automáticamente. Puede abandonarlo en cualqier momento y volver luego para continuar donde se quedó.');

export const ANSWER = gql`
mutation createAnswer($consultId: ID!, $answer: AnswerInput!){
  answer(consultId:$consultId, answer: $answer){
    success,
    message
  }
}
`;

const Answer = () => {
    // mutation to save answer
    const [answer, { loadingAns, errorAns }] = useMutation(
        ANSWER,
        {
            onCompleted(returnData) {
                console.log(returnData);
            }
        }
    );
    if (loadingAns) console.log('loading answer');
    if (errorAns) console.log('error in answer');

    // getting data from specialist
    const {
        data,
        loadingEsp,
        errorEsp
    } = useQuery(ME);
    if (loadingEsp) console.log('loading specialist data');
    if (errorEsp || !data) console.log('error getting the specialist data');
    console.log(data);

    return (
        <Formik
            initialValues={{
                commentary: '',
                proposalDiagnosticTests: '',
                diagnosisPresumtive: '',
                diagnosisDefinitive: '',
                proposalEducation: '',
                proposalTherapy: '',
                illId: '',
                subillId: '',
            }}
            validate={values => {
                const errors = {};
                if (!values) {
                    errors.password = '';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                values.city = data.me.city;
                values.province = data.me.province;
                values.speciality = data.me.speciality;
                values.hospital = data.me.hospital;
                values.specialistName = data.me.name;
                
                console.log('sending this values:');
                console.log(values);

                answer({ variables: { consultId: 36, answer: values } });

                setSubmitting(false);
            }}
        >
            <AnswerForm />
        </Formik>
    );
}


export default Answer;