import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';

import { colors, fontSizes } from '../styles';

const style = css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid ${colors.background
        };
        border-radius: 5px;
        color: ${colors.textLight};
        padding: 1em ;
    }

    h1{
        color: ${colors.primary};
        text-align:center;
        margin-bottom: 0.5em;
    }
    
    h2{
        color: ${colors.tertiary};
        font-weight: 700;
        margin-bottom: 0.5em;
    }

    label{
        display: flex;
        flex-direction: column;
        color: ${colors.quaternary};
        font-weight: 700;
    }

    label>div{
        color: ${colors.error};
        font-weight: 400;
    }

    input{
        margin-top: 0;
    }
`;

const LoginForm = (props) => (
    <div css={style}>
        <Formik
            initialValues={{ username: '', password: '' }}
            validate={values => {
                const errors = {};
                if (!values.password) {
                    errors.password = 'Contraseña requerida';
                }
                if (!values.username) {
                    errors.username = 'Usuario requerido';
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                props.login({
                    variables: {
                        username: values.username,
                        password: values.password
                    }
                });
            }}
         >
            {({ isSubmitting }) => (
                <Form>
                    <h1>Telemedicina Cayapas</h1>
                    <h2>Ingresar</h2>
                    <div>{props.warningMessage}</div>
                    <label> Usuario
                        <ErrorMessage name="username" component="div" />
                        <Field type="text" name="username" />
                    </label>
                    <label> Contraseña
                        <ErrorMessage name="password" component="div" />
                        <Field type="password" name="password" />
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                        Entrar
                    </button>
                </Form>
            )}
        </Formik>
    </div>
);

export default LoginForm;

