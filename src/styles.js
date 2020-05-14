import { css } from '@emotion/core';

export const colors = {
  primary: '#296CF2',
  secondary: '#3587F2',
  tertiary: '#41A0F2',
  quaternary: '#57C6F2',
  accent: '#F2A007',
  background: '#F2F2F2',
  grey: '#8C8C8C',
  greyLight: '#C4C4C4',
  text: '#0D0D0D',
  textSecondary: '#262626',
  textLight: 'white',
  white: 'white',
  warning: '#F2B705',
  error: '#D93D3D'
};

export const fontSizes = {
  veryLarge: '4em',
  large: '2em',
  normal: '1em',
  small: '0.8em',
  verySmall: '0.3em',
};

// export const unit = 8;
export const global = css`
  html{
    font-family: 'Noto Sans', sans-serif;
    background: ${colors.background};
    color: ${colors.text};
  }

  html, body {
    height: 100%;
  }

  body{
    margin: 0;
    padding: 0;
  }

  #root{
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  h1, h2, h3 {
    font-family: 'Noto Serif', serif;
    margin: 0;
    padding: 0;
  }

  button{
    font-family: inherit;
    font-weight: 700;
    background: ${colors.primary};
    color:${colors.white};
    border: none;
    border-radius: 5px;
    padding: 0.7em 1.5em;
    margin: 1em 0;
  }

  input{
    font-family: inherit;
    background: ${colors.white};
    color:${colors.text};
    border: 1px solid ${colors.greyLight};
    border-radius: 5px;
    padding: 0.7em 1.5em;
    margin: 1em 0;
  }

  ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }

`;



// export default () => injectGlobal({
//     [['html', 'body']]: {
//       height: '100%',
//     },
//     body: {
//       margin: 0,
//       padding: 0,
//       fontFamily: "'Source Sans Pro', sans-serif",
//       backgroundColor: colors.background,
//       color: colors.text,
//     },
//     '#root': {
//       display: 'flex',
//       flexDirection: 'column',
//       minHeight: '100%',
//     },
//     '*': {
//       boxSizing: 'border-box',
//     },
//     [['h1', 'h2', 'h3', 'h4', 'h5', 'h6']]: {
//       margin: 0,
//       fontWeight: 600,
//     },
//     h1: {
//       fontSize: 48,
//       lineHeight: 1,
//     },
//     h2: {
//       fontSize: 40,
//     },
//     h3: {
//       fontSize: 36,
//     },
//     h5: {
//       fontSize: 16,
//       textTransform: 'uppercase',
//       letterSpacing: 4,
//     }
//   });