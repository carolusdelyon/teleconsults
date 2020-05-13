/**
 * Submitting the answer, these are the proccedings:
 * 1) send the form to be saved
 * 2) is returned the id with wich was saved the form
 * 3) this id is used to upload the attached files to 
 *      the corresponding directories
 * 4) the filenames are returned as success confirmation
 * 5) these filenames are saved in the yet saved form,
 *      updating it.
*/

import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import AnswerForm from '../components/answerForm';
import { ME } from './profile';
import { useParams } from 'react-router-dom';
import AutoSave from '../components/autosave';

// setInfoForm('Se cargó un formulario guardado.');
// setInfoForm('Este formulario se guarda automáticamente. Puede abandonarlo en cualqier momento y volver luego para continuar donde se quedó.');

export const ANSWER = gql`
mutation createAnswer($consultId: ID!, $answer: AnswerInput!){
  answer(consultId:$consultId, answer: $answer){
    success,
    message,
    answer{
        id
    }
  }
}
`;
export const UPDATE_ANSWER = gql`
mutation updateAnswer($answer: AnswerInput!){
    updateAnswer(answer: $answer){
    success,
    message,
    answer{
        id
    }
  }
}
`;

export const FILE_UPLOAD = gql`
  mutation fileUpload($files: [Upload]!, $type:uploadType!, $id:ID!) {
    upload(files: $files, type:$type, id:$id){
        filename
    }
  }
`;

export const UPDATE_ATTACHMENTS = gql`
  mutation updateAttachment($type:uploadType!, $id:ID!, $filenames: [String]!, ) {
    updateAttachments(type:$type, id:$id, filenames: $filenames)
  }
`;

const Answer = ({ answer }) => {
    let { consultId } = useParams();
    const [answerId, setAnswerId] = useState(null);

    // mutation to save answer
    const [saveAnswer, { loading: loadingAns, error: errorAns }] = useMutation(
        ANSWER,
        {
            onCompleted(returnData) {
                console.log(returnData); //remove
                
                // if there are attachments
                if (files) {
                    setAnswerId(returnData.answer.answer.id);
                    // uploading files with the returned id
                    upload({
                        variables: {
                            files,
                            type: 'ANSWER',
                            id: returnData.answer.answer.id
                        }
                    });
                }
            }
        }
    );
    if (loadingAns) console.log('loading answer');
    if (errorAns) console.log('error in answer');

    // mutation to save answer
    const [updateAnswer, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
        UPDATE_ANSWER,
        {
            onCompleted(returnData) {
                console.log(returnData); // remove
            }
        }
    );
    if (loadingUpdate) console.log('loading update answer');
    if (errorUpdate) console.log('error in update answer');

    // files state
    const [files, setFiles] = useState(null);
    // uploading files attachment mutation
    const [upload, { loading: loadingUpload,
        error: errorUpload }] = useMutation(
            FILE_UPLOAD,
            {
                onCompleted(returnData) {
                    // updating the filenames of the
                    // attachments succesfully uploaded
                    updateAttachment({
                        variables: {
                            type: 'ANSWER',
                            id: answerId,
                            filenames: returnData.upload.map(file => file.filename)
                        }
                    });
                }
            }
        );
    if (loadingUpload) console.log('loading upload ');
    if (errorUpload) console.log('error in upload' + JSON.stringify(errorUpload));

    // update attachments mutation
    const [updateAttachment, { loading: loadingAttachment,
        error: errorAttachment }] = useMutation(
            UPDATE_ATTACHMENTS,
            {
                onCompleted(returnData) {
                    console.log(returnData);
                }
            }
        );
    if (loadingAttachment) console.log('loading update filename');
    if (errorAttachment) console.log('error in update filename' + JSON.stringify(errorAttachment));

    // getting data from specialist
    const {
        data: dataEspecialist,
        loading: loadingEsp,
        error: errorEsp
    } = useQuery(ME);
    if (loadingEsp) console.log('loading specialist dataEspecialist');
    if (errorEsp || !dataEspecialist) console.log('error getting the specialist dataEspecialist');
    // console.log(dataEspecialist);

    return (
        <Formik
            // TODO: improve this
            initialValues={{
                commentary: answer ? answer.commentary : '',
                proposalDiagnosticTests: answer ? answer.proposalDiagnosticTests : '',
                diagnosisPresumtive: answer ? answer.diagnosisPresumtive : '',
                diagnosisDefinitive: answer ? answer.diagnosisDefinitive : '',
                proposalEducation: answer ? answer.proposalEducation : '',
                proposalTherapy: answer ? answer.proposalTherapy : '',
                illId: answer ? answer.illId : '',
                subillId: answer ? answer.subillId : '',
            }}
            validate={values => {
                const errors = {};
                if (!values) {
                    errors.password = '';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                values.city = dataEspecialist.me.city;
                values.province = dataEspecialist.me.province;
                values.speciality = dataEspecialist.me.speciality;
                values.hospital = dataEspecialist.me.hospital;
                values.specialistName = dataEspecialist.me.name;

                console.log('sending this values:');
                console.log(values);

                // selecting either creating or updating
                let id = consultId;
                console.log(id); // remove

                !answer.id && saveAnswer({ variables: { consultId: id, answer: values } });

                // values.id = answer.id;
                // updateAnswer({ variables: { answer: values } });
                setSubmitting(false);
            }}
        >
            <>
                <AnswerForm setFiles={setFiles} />
                <AutoSave />
            </>
        </Formik >
    );
}


export default Answer;