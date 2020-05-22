import React, { useState } from 'react';
import { Form, Field, ErrorMessage } from 'formik';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors, fontSizes } from '../styles';
import { useLocation } from 'react-router-dom';

const attachedFileSizeLimit = 5000000;

const style = css`
   
    .section-form{
        transition: 0.5s;
        overflow: hidden;
        text-align: left;
    }

    .open{
        max-height: 1000px;
    }

    .close{
        max-height: 0;
    }

    h3{
        background: ${colors.quaternary};
        color:  ${colors.primary};
        /* border: 1px solid ${colors.greyLight} */
        margin-bottom: 0.1em;
        padding: 0.8em;
    }

    label{
        display: flex;
        flex-direction: column;
        color: ${colors.quaternary};
        font-weight: 700;
        margin: 0.8em 0;
    }

    label>div{
        color: ${colors.error};
        font-weight: 400;
    }

    input{
        margin-top: 0;
        border: 1px solid ${colors.greyLight};
    }

    textarea{
        outline: none;
        border: 1px solid ${colors.greyLight};
        border-radius: 5px;
        padding: 1em;
        box-sizing: border-box;
        font-family: inherit;
        min-height: 8em;
    }

    button{
        display: block;
        margin: 0 auto;
        margin-top: 1em;
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

// `setFiles` control the files stack to be attached
function AnswerForm({ isSubmitting, resetForm, setFiles }) {
    const { pathname } = useLocation();

    // state to control ill and subills datalists
    const [selectedIll, setSelectedIll] = useState(null);

    // get ills
    const {
        data: dataIll,
        loading: loadingIll,
        error: errorIll
    } = useQuery(ILLS);
    // if (loading) console.log('loading specialist data');
    // if (error || !data) console.log('error getting the specialist data');

    const {
        data: dataSubill,
        loading: loadingSubill,
        error: errorSubill
    } = useQuery(SUBILLS, {
        variables: { id: selectedIll }
    });

    function illSelection(e) {
        dataIll.ills && setSelectedIll(e.target.value);
    }

    // TODO: make a better validation
    function validateFile({ target }) {
        const files = target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            console.log(file); // remove

            if (file.size > attachedFileSizeLimit) {
                alert('El tamaño del archivo excede el límite permitido.');
                target.value = null;
                setFiles(null);
                return null;
            }
        }
        target.validity.valid && setFiles(files);
    }

    return (
        <Form css={style}>
            <Accordion number="1" title="Comentarios al cuadro clínico de teleconsulta">
                <ErrorMessage name="commentary" component="div" />
                <label>Comentario
			        <Field as="textarea" name="commentary" />
                </label>
            </Accordion>

            <Accordion number="2" title="Pruebas diagnósticas propuestas">
                <ErrorMessage name="proposalDiagnosticTests" component="div" />
                <label>Comentario
			        <Field as="textarea" name="proposalDiagnosticTests" />
                </label>
            </Accordion>

            <Accordion number="3" title="Diagnósticos presuntivos o definitivos">
                <ErrorMessage name="commentary" component="div" />
                <label>Enfermedad
                        <Field list="ills" name="illId"
                        onInput={illSelection}
                    />
                    <datalist id="ills">
                        {dataIll.ills && dataIll.ills.map((ill, index) => (
                            <option key={index} value={ill.id}>{ill.id} - {ill.name}</option>
                        ))}
                    </datalist>
                </label>
                {selectedIll && <label>Sub Enfermedad
                        <Field list="subills" name="subillId" />
                    <datalist id="subills">
                        {dataSubill.ill && dataSubill.ill.subIlls && dataSubill.ill.subIlls.map((subill, index) => (
                            <option key={index} value={subill.id}>{subill.id} - {subill.name}</option>
                        ))}
                    </datalist>
                </label>}

                <label>Diagnóstico presuntivo
			        <Field as="textarea" name="diagnosisPresumtive" />
                </label>
                <label>Diagnóstico definitivo
			        <Field as="textarea" name="diagnosisDefinitive" />
                </label>
            </Accordion>

            <Accordion number="4" title="Plan educacional propuesto">
                <ErrorMessage name="proposalEducation" component="div" />
                <label>Comentario
			        <Field as="textarea" name="proposalEducation" />
                </label>
            </Accordion>

            <Accordion number="5" title="Plan terapéutico propuesto">
                <ErrorMessage name="proposalTherapy" component="div" />
                <label>Comentario
			        <Field as="textarea" name="proposalTherapy" />
                </label>
            </Accordion>

            <Accordion number="6" title="Archivos adjuntos">
                <ErrorMessage name="attachedFiles" component="div" />
                <label> <i className="material-icons">attach_file</i>
                    <input type="file" multiple onChange={validateFile} />
                </label>
            </Accordion>

            <div>
                <button type="reset" css={css`
                        background: ${colors.tertiary};
                        font-size: ${fontSizes.small};
                    `}
                    onClick={resetForm}>
                        Reiniciar Formulario
                </button>

                <button type="submit" disabled={isSubmitting}>
                    {/.*\/consults\/[1-9]*\/answer$/.test(pathname) ? 'Responder' :
                        /.*\/consults\/[1-9]*\/answer\/[1-9]*$/.test(pathname) ? 'Actualizar' : ''}
                </button>
            </div>
        </Form>
    );


}

// Main sections of forms, plegables
const Accordion = (props) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <section>
            <h3 onClick={() => setOpen(!isOpen)}>
                <span className="round">{props.number}</span> {props.title}
            </h3>
            <div className={'section-form ' + (isOpen ? 'open' : 'close')}>
                {props.children}
            </div>
        </section>
    );
}

export default AnswerForm;