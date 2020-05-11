import React from "react";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Loading from '../components/loading';
import Header from '../components/header';

export const ME = gql`
  query me{
      me{
          name
          username 
          speciality
          speciality2
          hospital
          province
          city
          phone
      }
  }
`;

export default function Pages() {
  const {
    data,
    loading,
    error
  } = useQuery(ME);

  if (loading) return <Loading />;
  if (error || !data) return <p>Error getting user data :(</p>;

  /** This is a dirty workaround to solve the not
  * automatic update of the token in the local 
  * storage. // remove
  * 
  * TODO: fix this as soon as possible
  **/
  if (!data.me) window && window.location.reload();

  return (
    <>
      <Header headerText={data.me.name} />
      <h2>Información del usuario</h2>
      <ul>
        <li>
          <span>Nombre: </span>
          <span>{data.me.name}</span>
        </li>
        <li>
          <span>Nombre de usuario: </span>
          <span>{data.me.username}</span>
        </li>
        <li>
          <span>Especialidad: </span>
          <span>{data.me.speciality}</span>
          {data.me.speciality2 && <span>{data.me.speciality2}</span>}
        </li>
        <li>
          <span>Hospital: </span>
          <span>{data.me.hospital}</span>
        </li>
        <li>
          <span>Provincia: </span>
          <span>{data.me.province}</span>
        </li>
        <li>
          <span>Cantón: </span>
          <span>{data.me.city}</span>
        </li>
        <li>
          <span>Teléfono: </span>
          <span>{data.me.phone}</span>
        </li>
      </ul>

    </>
  );
}