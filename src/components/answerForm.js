import React, { useState } from 'react';
import { Form, Field, ErrorMessage } from 'formik';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// comentary: "anothertest"
// proposalDiagnosticTests: "anothertest"
// diagnosisPresumtive: "anothertest"
// diagnosisDefinitive: "anothertest"
// proposalEducation: "anothertest"
// proposalTherapy: "anothertest"
// illId: "anothertest"
// subillId: "anothertest"
// ////////////////
// city: "anothertest"
// province: "anothertest"
// speciality: "anothertest"
// date: "anothertest"
// hospital: "anothertest"
// specialistName: "anothertest"

export const ILLS = gql`
  query ills{
      ills{
          id
          name
      }
  }
`;

function AnswerForm({ isSubmitting, resetForm }) {
    // get ills
    const {
        data,
        loadingEsp,
        errorEsp
    } = useQuery(ILLS);
    // if (loadingEsp) console.log('loading specialist data');
    // if (errorEsp || !data) console.log('error getting the specialist data');

    return (
        <>
            <Form>
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
                    <div className="center">
                        <label>Enfermedad
			            <select name="illId">
                            {data.ills && data.ills.map((ill, index) => (
                                <option key={index}>{ill.id} - {ill.name}</option>
                            ))}
                        </select>
                        <br />
                        <select name="subillId">
                        </select>
                        </label>
                    </div>
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
                    <label>
                        <div className="center">
                            <button><i className="material-icons">attach_file</i>Adjuntar archivo</button>
                        </div>
                    </label>
                </Accordion>

                <div className="center">
                    <button type="reset"
                        onClick={resetForm}>
                        <i className="material-icons">delete_sweep</i>
                        Reiniciar Formulario
                    </button>
                </div>

                <button type="submit" disabled={isSubmitting}>
                    Submit
               </button>
            </Form>
        </>
    );


}

// Main sections of forms, plegables
const Accordion = (props) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <section>
            <h3 onClick={() => setOpen(!isOpen)}>
                <span className="counter">{props.number}</span> {props.title}
            </h3>
            <div className={'section-form ' + (isOpen ? 'open' : 'close')}>
                {props.children}
            </div>
        </section>
    );
}

export default AnswerForm;