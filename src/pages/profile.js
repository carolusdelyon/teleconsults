import React, { useState, Fragment } from "react";
import gql from 'graphql-tag';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Loading from '../components/loading';
import { colors, fontSizes, listStyle } from '../styles';
import { logout } from '../components/logout-button';
import { styletile } from '../styles';
import { registertNotifications, unsusbsribe } from "../utils";

const style = css`
  text-align: center;

  ${listStyle}

  .material-icons{
    margin-left: 1em;
    cursor: pointer;
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
    }
  }
`;

export default function Pages() {
  // state to control wether are editing the profile data
  const [isEditing, setIsEditing] = useState(false);

  const client = useApolloClient();

  // mutation to update profile data
  const [userUpdate, { loading: loadingUserUpdate, error: errorUserUpdate }] = useMutation(
    UPDATE_USER,
    {
      onCompleted(returnData) {
        console.log(returnData); //remove
        alert(returnData.updateUser.message);
        if (returnData.updateUser.success && returnData.updateUser.username === dataMe.me.username) {
          window.location.reload();
        } else {
          logout(client);
        }
      }
    }
  );
  if (loadingUserUpdate) console.log('loading update user');
  if (errorUserUpdate) console.log('error updating the user');

  const {
    data: dataMe,
    loading: loadingMe,
    error: errorMe
  } = useQuery(ME, { fetchPolicy: "network-only" });

  if (loadingMe) return <Loading />;
  if (errorMe || !dataMe){
    console.log(errorMe);
    return <p>Error getting user data in profile :(</p>;
}

  /** This is a dirty workaround to solve the not
  * automatic update of the token in the local 
  * storage. // remove
  * 
  * TODO: fix this as soon as possible
  **/
  if (!dataMe.me) window && window.location.reload();

  // notify if there is any edition running
  function notify() {
    setIsEditing(true);
  }

  return (
    <Formik
      initialValues={{
        username: dataMe.me.username,
        password: '',
        email: dataMe.me.email,
        phone: dataMe.me.phone
      }}
      validate={values => {
        const errors = {};
        if (!values.password) {
          // errors.password = 'Contraseña requerida';
        }
        if (!values.username) {
          errors.username = 'Usuario requerido';
        }
        if (!values.email) {
          errors.username = 'Email requerido';
        }
        if (!values.phone) {
          errors.username = 'Telefono requerido';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        if (window.confirm('¿Está seguro de actualizar estos datos?')) {

          console.log('sending....'); // remove
          console.log(values); // remove

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
            <div css={style}>
              <h2>Información</h2>
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
                        break;
                      case 'RURAL':
                        return <span key={i}>{'Médico Rural '}</span>;
                        break;
                      case 'COORDINATOR':
                        return <span key={i}>{'Coordinador '}</span>;
                        break;
                      default:
                        return <span key={i}>? </span>;
                        break;
                    }
                  })}</span>
                </li>
                <ProfileItem notify={notify} type="text" name="username" label="Nombre de usuario" value={dataMe.me.username} />
                <ProfileItem notify={notify} type="text" name="email" label="Correo" value={dataMe.me.email} />
                <ProfileItem notify={notify} type="text" name="phone" label="Teléfono" value={dataMe.me.phone} />
                <ProfileItem notify={notify} type="password" name="password" label="Contraseña" value="******" />
                <li>
                  <span>Especialidad</span>
                  <span>{dataMe.me.speciality}</span>
                  {dataMe.me.speciality2 && <span>{dataMe.me.speciality2}</span>}
                </li>
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

              {isEditing && <button type="submit" disabled={isSubmitting}>
                Guardar cambios
          </button>}
            </div>
          </Form>
          {/* TODO: improve */}
          <button css={css`
            margin: 0 auto;
            display: block;
          `}
            onClick={ 
              () => {
                registertNotifications({ username: dataMe.me.username });
                alert('Ha sido registrado para recibir notificaciones');
              }
            }>
            Recibir notificaciones</button>
          <button css={css`
            background: ${colors.quaternary};
            margin: 0 auto;
            display: block;
            margin-top: 1em;
          `}
            onClick={ 
              () => {
                unsusbsribe();
                alert('Ha cancelado su suscripción para recibir notificaciones.');
              }
            }>
            Cancelar notificaciones</button>
        </div>
      )}
    </Formik>
  );
}

const ProfileItem = ({ label, value, notify, name, type }) => {
  // state to control wether are editing the profile data
  const [isEditing, setIsEditing] = useState(false);

  function updateIsEditing() {
    setIsEditing(true);
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
    </li>
  );
}