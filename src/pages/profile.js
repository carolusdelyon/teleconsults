import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import gql from 'graphql-tag';
import Isemail from 'isemail';
import { useState } from 'react';
import Loading from '../components/loading';
import { logout } from '../components/logout-button';
import { listStyle } from '../styles';
import { registerNotifications, unsusbsribe } from '../utils';
import {colors} from '../styles';

const style = css`
  ${listStyle}
  .material-icons{
    margin-left: 1em;
    cursor: pointer;
  }

  div>button:nth-child(2){
    background: ${colors.quaternary};
  }
  div>button{
    display: block;
    margin: 2em auto;
  }
`;

export const ME = gql`
  query me{
      me{
          id
          roles
          name
          username
          email
          speciality
          speciality2
          hospital
          province
          city
          phone
      }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($user: UserInput!) {
    updateUser(user: $user){
      success
		  message
      user{
        username
      }
    }
  }
`;

export default function Profile() {
  // state to control globally in this form
  // wether are editing the profile data or not
  const [isEditing, setIsEditing] = useState(false);

  const client = useApolloClient();

  // mutation to update profile data
  const [userUpdate, { loading: loadingUserUpdate, error: errorUserUpdate }] = useMutation(
    UPDATE_USER,
    {
      onCompleted(returnData) {
        console.log(returnData); //remove
        alert(returnData.updateUser.message);
        // refresh user data
        refetchMe().then(() => {
          // logout if the username has changed
          if (returnData.updateUser.success && returnData.updateUser.user.username !== dataMe.me.username) {
            logout(client);
          }
        }
        ).catch(error => Error('Error refreshing: ' + error));
      }
    }
  );

  const {
    data: dataMe,
    loading: loadingMe,
    error: errorMe,
    refetch: refetchMe
  } = useQuery(ME);

  if (loadingMe) return <Loading />;
  if (errorMe || !dataMe) {
    console.log(errorMe);
    return <p>Error obteniendo los datos del usuario :(</p>;
  }
  if (loadingUserUpdate || !dataMe.me) return <Loading />;
  if (errorUserUpdate) return <p>Error actualizando el usuario :(</p>;

  // notify if there is any edition running
  function notify() {
    setIsEditing(true);
  }

  return (
    <div css={style}>
      <Formik
        enableReinitialize
        initialValues={{
          username: dataMe.me.username,
          password: '',
          email: dataMe.me.email,
          phone: dataMe.me.phone
        }}
        validate={values => {
          const errors = {}
          // TODO: create restrictions to username
          // and adapt phone validations
          if (!values.username) {
            errors.username = 'Usuario requerido';
          }
          if (!values.email) {
            errors.email = 'Email requerido';
          }
          if (!values.phone) {
            errors.phone = 'Telefono requerido';
          }
          if (!Isemail.validate(values.email)) {
            errors.email = 'Email no válido';
          }
          if (!/^09[0-9]{8}$/.test(values.phone)) {
            errors.phone = 'Teléfono movil no válido';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (window.confirm('¿Está seguro de actualizar sus datos?')) {
            userUpdate({
              variables: {
                user: values
              }
            });
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <div>
            <Form>
              <h2>Mis datos</h2>
              <ul>
                <li>
                  <span>Nombre</span>
                  <span>{dataMe.me.name}</span>
                </li>
                <li>
                  <span>Roles</span>
                  <span>{dataMe.me.roles.map((role, i) => {
                    switch (role) {
                      case 'SPECIALIST':
                        return <span key={i}>{'Especilista '}</span>;
                      case 'RURAL':
                        return <span key={i}>{'Médico Rural '}</span>;
                      case 'COORDINATOR':
                        return <span key={i}>{'Coordinador '}</span>;
                      default:
                        return <span key={i}>? </span>;
                    }
                  })}</span>
                </li>
                <li>
                  <span>Especialidad</span>
                  <span>{dataMe.me.speciality}</span>
                  {dataMe.me.speciality2 && <span>{dataMe.me.speciality2}</span>}
                </li>
                <ProfileItem notify={notify} type="text" name="username" label="Nombre de usuario" value={dataMe.me.username} />
                <ProfileItem notify={notify} type="text" name="email" label="Correo" value={dataMe.me.email} />
                <ProfileItem notify={notify} type="text" name="phone" label="Teléfono" value={dataMe.me.phone} />
                <ProfileItem notify={notify} type="password" name="password" label="Contraseña" value="******" />
                <li>
                  <span>Hospital</span>
                  <span>{dataMe.me.hospital}</span>
                </li>
                <li>
                  <span>Provincia</span>
                  <span>{dataMe.me.province}</span>
                </li>
                <li>
                  <span>Cantón</span>
                  <span>{dataMe.me.city}</span>
                </li>
              </ul>
              {/* edition buttons */}
              {isEditing &&
                <div>
                  <button type="submit" disabled={isSubmitting}>
                    Guardar cambios
                  </button>
                  <button type="button" disabled={isSubmitting}
                    // TODO: improve this without realoading the page
                    onClick = {
                      () => window.location.reload()
                    }>
                    Cancelar
                  </button>
                </div>}
            </Form>
            {/* subscriptions buttons */}
            {!isEditing &&
              <div>
                <button onClick={
                  () => {
                    registerNotifications({ username: dataMe.me.username });
                    alert('Ha sido registrado para recibir notificaciones');
                  }
                }>Recibir notificaciones</button>
                <button onClick={
                  () => {
                    unsusbsribe();
                    alert('Ha cancelado su suscripción. No volverá a recibir notificaciones.');
                  }
                }>Cancelar notificaciones</button>
              </div>
            }
          </div>
        )}
      </Formik>
    </div>
  );
}

const ProfileItem = ({ label, value, notify, name, type }) => {
  // state to control wether are editing the profile data
  const [isEditing, setIsEditing] = useState(false);

  function updateIsEditing() {
    setIsEditing(true);
    // notifing the form that we are in editing mode
    notify();
  }

  return (
    <li>
      <span>{label}</span>
      {!isEditing && <span>{value}</span>}
      {!isEditing && <span className="material-icons round"
        onClick={updateIsEditing}
      >create
        </span>
      }
      {isEditing &&
        <Field type={type} name={name} />}
      {isEditing &&
        <ErrorMessage css={css`
            color: ${colors.error};
            margin-left: 1em;
        `}
        name={name} component="span" />}
    </li>
  );
}