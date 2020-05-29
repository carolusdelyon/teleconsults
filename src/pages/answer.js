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

import { useMutation, useQuery } from '@apollo/react-hooks';
import { Formik } from 'formik';
import gql from 'graphql-tag';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnswerForm from '../components/answerForm';
import AutoSave from '../components/autosave';
import { ME } from './profile';
import Loading from '../components/loading';

export const ANSWER = gql`
mutation createAnswer($consultId: ID!, $answer: AnswerInput!){
  answer(consultId: $consultId, answer: $answer){
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

export const ILLS = gql`
  query ills{
      ills{
          id
          name
      }
  }
`;

export const SUBILLS = gql`
  query subills($id: ID!) {
    ill(id: $id){
        subIlls{
            id
            name
        }
    }
  }
`;

// update the atachment field once the files has been succesfully uploaded
// see above
export const UPDATE_ATTACHMENTS = gql`
  mutation updateAttachment($type:uploadType!, $id:ID!, $filenames: [String]!, ) {
    updateAttachments(type:$type, id:$id, filenames: $filenames)
  }
`;

const Answer = ({ answer }) => {
    let { consultId } = useParams();
    // once uploaded the answer this state is filled
    // from the mutation response, and used to identify the
    // `updateAttachment` 
    const [answerId, setAnswerId] = useState(null);

    // updated when a file is selected to be uploaded
    const [files, setFiles] = useState([]);

    // state to control ill and subills datalists
    const [selectedIllId, setSelectedIllId] = useState(null);
    const [selectedSubIllId, setSelectedSubIllId] = useState(null);

    // getting data from specialist
    const {
        data: dataSpecialist,
        loading: loadingEsp,
        error: errorEsp
    } = useQuery(ME);

    const [saveAnswer, { loading: loadingAns, error: errorAns }] = useMutation(
        ANSWER,
        {
            onCompleted(returnData) {
                console.log(returnData); //remove

                // if there are attachments continue
                // with files transaction
                if (files.length > 0) {
                    setAnswerId(returnData.answer.answer.id);
                    // uploading files with the returned id
                    uploadFiles({
                        variables: {
                            files,
                            type: 'ANSWER',
                            id: returnData.answer.answer.id
                        }
                    });
                } else { // ending the transaction
                    if (returnData.answer.success) {
                        alert('Su respuesta fue exitosamente guardada');
                        window.location.href = '/consults';
                    } else {
                        alert('Hubo un error al guardar su respuesta');
                    }
                }
            }
        }
    );

    // uploading files attachment mutation
    const [uploadFiles, { loading: loadingUpload,
        error: errorUpload }] = useMutation(
            FILE_UPLOAD,
            {
                onCompleted(returnData) {
                    console.log(returnData); // remove
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

    // update attachments mutation, used once the files has been uploaded
    const [updateAttachment, { loading: loadingAttachment,
        error: errorAttachment }] = useMutation(
            UPDATE_ATTACHMENTS,
            {
                onCompleted(returnFiles) {
                    console.log(returnFiles); // remove
                    if (returnFiles.updateAttachments.length > 0) {
                        alert(`Su respuesta fue exitosamente ${answer.id ? 'actualizada' : 'guardada'}`);
                        window.location.href = '/consults';
                    } else {
                        alert(`Hubo un error al ${answer.id ? 'actualizar' : 'guardar'} su respuesta`);
                    }
                }
            }
        );

    // mutations to yet created answers to be updated
    const [updateAnswer, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
        UPDATE_ANSWER,
        {
            onCompleted(returnData) {
                console.log(returnData); // remove
                // ending the transaction
                if (returnData.updateAnswer.success) {

                    if (files.length > 0) {
                        setAnswerId(answer.id);
                        // uploading files
                        uploadFiles({
                            variables: {
                                files,
                                type: 'ANSWER',
                                id: answer.id
                            }
                        });
                    }else{
                        alert('Su respuesta fue exitosamente actualizada');
                        window.location.href = '/consults';
                    }
                } else {
                    alert('Hubo un error al actualizar su respuesta');
                }
            }
        }
    );

    // get all ills
    const {
        data: dataIll,
        loading: loadingIll,
        error: errorIll
    } = useQuery(ILLS);

    // used once a main ill is selected
    const {
        data: dataSubill,
        loading: loadingSubill,
        error: errorSubill
    } = useQuery(SUBILLS, {
        variables: { id: selectedIllId }
    });

    // setting the corresponding ills names if it's an answer update
    useEffect(() => {
        if (answer && answer.id && answer.illId && dataIll.ills) {
            if (answer.illId) setSelectedIllId(answer.illId);
            const ill = dataIll.ills.filter(ill => ill.id === answer.illId)[0];
            if (ill && ill.name) answer.illName = ill.name;
        }
    }, [dataIll]);
    useEffect(() => {
        if (answer && answer.id && answer.subillId && dataSubill && dataSubill.ill) {
            if (answer.subillId) setSelectedSubIllId(answer.subillId);
            const subill = dataSubill.ill.subIlls.filter(subill => subill.id === answer.subillId)[0];
            if(subill && subill.name) answer.subillName = subill.name;
        }
    }, [dataSubill]);

    if (loadingIll || !dataIll.ills) return <Loading />;
    if (errorIll || !dataIll) return <p>Error obteniendo las enfermedades :(</p>;
    if (loadingSubill) console.log('getting subills...');
    if (errorSubill || !dataSubill) console.log('Error getting subills :(');

    if (loadingEsp) return <Loading />;
    if (errorEsp || !dataSpecialist) return <p>Error buscando los datos del especialista :(</p>;
    if (loadingAns) return <Loading />;
    if (errorAns) return <p>Error creando la respuesta :(</p>;
    if (loadingUpload) return <Loading />;
    if (errorUpload) return <p>Error subiendo los archivos adjuntos :(</p>;
    if (loadingAttachment) return <Loading />;
    if (errorAttachment) return <p>Error actualizando los archivos adjuntos :(</p>;
    if (loadingUpdate) return <Loading />;
    if (errorUpdate) return <p>Error actualizando la respuesta :(</p>;

    // showing only if we have the names loaded in case of an update
    // or if its a brand new form
    if (!answer || (answer && !answer.id) || (answer && answer.id && answer.illName && answer.subillName)) return (
        <Formik
            initialValues={{
                commentary: answer ? answer.commentary : '',
                proposalDiagnosticTests: answer ? answer.proposalDiagnosticTests : '',
                diagnosisPresumtive: answer ? answer.diagnosisPresumtive : '',
                diagnosisDefinitive: answer ? answer.diagnosisDefinitive : '',
                proposalEducation: answer ? answer.proposalEducation : '',
                proposalTherapy: answer ? answer.proposalTherapy : '',
                // TODO: fix tis loading the correct data when resuming the form
                illName: (answer && answer.id) ? answer.illName : '',
                subillName: (answer && answer.id) ? answer.subillName : '',
            }}
            validate={values => {
                const errors = {};
                if (!values.commentary) {
                    errors.commentary = 'Comentario necesario';
                }
                if (!values.proposalDiagnosticTests) {
                    errors.proposalDiagnosticTests = 'Diagnóstico necesario';
                }
                if (!values.diagnosisPresumtive) {
                    errors.diagnosisPresumtive = 'Diagnóstico necesario';
                }
                if (!values.diagnosisDefinitive) {
                    errors.diagnosisDefinitive = 'Diagnóstico necesario';
                }
                if (!values.proposalEducation) {
                    errors.proposalEducation = 'Propuesta educativa necesaria';
                }
                if (!values.proposalTherapy) {
                    errors.proposalTherapy = 'Propuesta terapéutica necesaria';
                }
                if (!values.illName) {
                    errors.illId = 'Enfermedad necesaria';
                }
                if (!values.subillName) {
                    errors.subillId = 'Subenfermedad necesaria';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                if (window.confirm('¿Está seguro de guardar esta respuesta?')) {
                    values.city = dataSpecialist.me.city;
                    values.province = dataSpecialist.me.province;
                    values.speciality = dataSpecialist.me.speciality;
                    values.hospital = dataSpecialist.me.hospital;
                    values.specialistName = dataSpecialist.me.name;
                    values.illId = selectedIllId;
                    values.subillId = selectedSubIllId;
                    values.illName && delete values.illName;
                    values.subillName && delete values.subillName;

                    // either creating or updating the answer
                    if (!answer || (answer && !answer.id)) {
                        saveAnswer({ variables: { consultId, answer: values } });
                    } else {
                        values.id = answer.id;
                        updateAnswer({ variables: { answer: values } });
                    }
                }
                setSubmitting(false);
            }}
        >
            <>
                {/* TODO: improve thid multiple props */}
                <AnswerForm
                    files={files}
                    setFiles={setFiles}
                    dataIll={dataIll}
                    selectedIllId={selectedIllId}
                    dataSubill={dataSubill}
                    setSelectedIllId={setSelectedIllId}
                    setSelectedSubIllId={setSelectedSubIllId}
                    loadingSubill={loadingSubill}
                />
                <AutoSave />
            </>
        </Formik >
    ); else return <Loading />;
}


export default Answer;