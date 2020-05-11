import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const LoginForm = (props) => (
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
            props.login({ variables: { username: values.username,
                password: values.password } });
        }}
    >
        {({ isSubmitting }) => (
            <Form>
                <div>{props.warningMessage}</div>
                <Field type="text" name="username" />
                <ErrorMessage name="username" component="div" />
                <Field type="password" name="password" />
                <ErrorMessage name="password" component="div" />
                <button type="submit" disabled={isSubmitting}>
                    Submit
                </button>
            </Form>
        )}
    </Formik>
);

export default LoginForm;

