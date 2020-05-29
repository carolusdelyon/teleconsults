/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ErrorMessage, Field, Form } from 'formik';
import { useLocation } from 'react-router-dom';
import { colors, formStyle, listStyle } from '../styles';
import { attachedFileSizeLimit } from '../utils';
import Accordion from './accordion';
import DataList from './datalist';
import Loading from './loading';

function AnswerForm({ isSubmitting,
    resetForm,
    files,
    setFiles,
    dataIll,
    selectedIllId,
    dataSubill,
    setSelectedIllId,
    setSelectedSubIllId,
    loadingSubill
}) {
    const { pathname } = useLocation();

    // fetch corresponding id from ills selected, and update states
    function onSelectedIll({ target }) {
        if (target.value) {
            const ill = dataIll.ills.filter(ill => ill.name === target.value)[0];
            ill && ill.id && setSelectedIllId(ill.id);
        }
    }
    function onSelectedSubIll({ target }) {
        if (target.value) {
            const subill = dataSubill.ill.subIlls.filter(subill => subill.name === target.value)[0];
            subill && subill.id && setSelectedSubIllId(subill.id);
        }
    }

    // TODO: make a better validation
    function validateFile({ target }) {
        const file = target.files[0];

        if (file.size > attachedFileSizeLimit) {
            alert('El tamaño del archivo excede el límite permitido.');
            target.value = null; //emptying the control
            return null;
        }

        // if all is ok add the file to the stack to be uploaded
        target.validity.valid && setFiles([...files, file]);
    }

    // remove file from file stack
    function removeFile({ target }) {
        const filename = String(target.previousSibling.innerText);
        const file = files.filter(f => f.name === filename)[0];
        const temporalFiles = Array.from(files);
        temporalFiles.splice(temporalFiles.indexOf(file), 1);
        setFiles(temporalFiles);
    }

    return (
        <Form css={formStyle}>
            <ol>
                <Accordion title="Comentarios al cuadro clínico de teleconsulta">
                    <ErrorMessage name="commentary" component="div" />
                    <label>Comentario
			        <Field as="textarea" name="commentary" />
                    </label>
                </Accordion>

                <Accordion title="Pruebas diagnósticas propuestas">
                    <ErrorMessage name="proposalDiagnosticTests" component="div" />
                    <label>Comentario
			        <Field as="textarea" name="proposalDiagnosticTests" />
                    </label>
                </Accordion>

                {/* TODO: check why error message stop working */}
                <Accordion title="Diagnósticos presuntivos o definitivos">
                    {loadingSubill && <Loading size="1em" />}
                    <ErrorMessage name="illName" component="div" />
                    <label>Enfermedad
                        <DataList name="illName"
                            onInput={onSelectedIll}>
                            {dataIll.ills.map((ill, index) => (
                                <option key={index} value={ill.name}>{ill.id}</option>
                            ))}
                        </DataList>
                    </label>
                    <ErrorMessage name="subillName" component="div" />
                    {selectedIllId && !loadingSubill && dataSubill.ill && dataSubill.ill.subIlls &&
                        <label>Sub Enfermedad
                            <DataList name="subillName"
                                onInput={onSelectedSubIll}>
                                {dataSubill.ill.subIlls.map((subill, index) => (
                                    <option key={index} value={subill.name}>{subill.id}</option>
                                ))}
                            </DataList>
                        </label>}

                    <ErrorMessage name="diagnosisPresumtive" component="div" />
                    <label>Diagnóstico presuntivo
			        <Field as="textarea" name="diagnosisPresumtive" />
                    </label>
                    <ErrorMessage name="diagnosisDefinitive" component="div" />
                    <label>Diagnóstico definitivo
			        <Field as="textarea" name="diagnosisDefinitive" />
                    </label>
                </Accordion>

                <Accordion title="Plan educacional propuesto">
                    <ErrorMessage name="proposalEducation" component="div" />
                    <label>Comentario
			        <Field as="textarea" name="proposalEducation" />
                    </label>
                </Accordion>

                <Accordion title="Plan terapéutico propuesto">
                    <ErrorMessage name="proposalTherapy" component="div" />
                    <label>Comentario
			        <Field as="textarea" name="proposalTherapy" />
                    </label>
                </Accordion>

                <Accordion title="Archivos adjuntos" customcss={listStyle}>
                    <label><span><i className="material-icons">attach_file</i>Añadir adjunto</span>
                        <input type="file" hidden onChange={validateFile} />
                    </label>
                    {files.length > 0 &&
                        <ul css={css`i{float: right;}`}>
                            {files.map((file, index) =>
                                <li key={index}>
                                    <span>{file.name}</span>
                                    <i className="material-icons"
                                        onClick={removeFile}
                                    >delete</i>
                                </li>
                            )}
                        </ul>
                    }
                </Accordion>
            </ol>

            <div css={css`
                button:nth-child(1){
                    background: ${colors.quaternary};
                }
                button{
                    display: block;
                    margin: 2em auto;
                }
            `}>
                <button type="reset"
                    onClick={resetForm}>
                    Reiniciar Formulario
                </button>

                <button type="submit" disabled={isSubmitting}>
                    {/* selecting either 'respond' or 'update' label */}
                    {/.*\/consults\/[1-9]*\/answer$/.test(pathname) ? 'Responder' :
                        /.*\/consults\/[1-9]*\/answer\/[1-9]*$/.test(pathname) ? 'Actualizar' : ''}
                </button>
            </div>
        </Form>
    );


}

export default AnswerForm;