import React from 'react';

import Footer from '../components/footer';

export default function Pages(props) {
  return (
    <>
      {props.children}
      <Footer />
    </>
  );
}