/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import LogoFront from '../assets/logo-amigos.png';
import { colors, mediaqueries } from '../styles';


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
        color: ${colors.textLight};
        padding: 3em ;

        ${mediaqueries[0]} {
            border: 1px solid ${colors.greyLight};
            border-radius: 1em; 
        }
    }

    img{
        width: 100%;
        height: auto;
    }

    h1{
        color: ${colors.primary};
    }
    
    h2{
        color: ${colors.tertiary};
    }

    label{
        display: flex;
        flex-direction: column;
        color: ${colors.quaternary};
        font-weight: 700;
    }

    div{
        color: ${colors.error};
        font-weight: 400;
    }

    input{
        margin-top: 0;
    }
`;

const LoginForm = ({ login, warningMessage }) => (
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
                login({
                    variables: {
                        username: values.username,
                        password: values.password
                    }
                });
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <img src={LogoFront} />
                    <h1>Telemedicina Cayapas</h1>
                    <h2>Ingresar</h2>
                    <div className="warningText">{warningMessage}</div>
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

