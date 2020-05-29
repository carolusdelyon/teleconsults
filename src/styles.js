import { css } from '@emotion/core';

export const breakpoints = [576, 768, 992, 1200]

export const mediaqueries = breakpoints.map(
  bp => `@media (min-width: ${bp}px)`
)

export const colors = {
  primary: '#296CF2',
  secondary: '#3587F2',
  tertiary: '#41A0F2',
  quaternary: '#57C6F2',
  accent: '#F2A007',
  background: '#FFF',
  backgroundAltern: '#F2F2F2',
  grey: '#8C8C8C',
  greyLight: '#DADCE0',
  greyVeryLight: '#FAFAFA',
  text: '#0D0D0D',
  textSecondary: '#262626',
  textLight: 'white',
  white: 'white',
  warning: '#F2B705',
  error: '#D93D3D'
};

export const fontSizes = {
  veryLarge: '3em',
  large: '2em',
  normal: '1em',
  small: '0.8em',
  verySmall: '0.3em',
};

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
    display: block;
    margin: 0 auto;
  }

  #root{
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
  
  h1, h2, h3 {
    font-family: 'Noto Serif', serif;
    margin: 0;
    padding: 0;
  }

  h1{
    font-size: 1.5em;
    ${mediaqueries[1]}{
      font-size: 2em;
    }
  }

  h3{
      padding: 0.5em;
      color: ${colors.quaternary};
  }
  h4{
    margin: 0;
    padding: 0;
  }

  button{
    font-family: inherit;
    font-size: inherit;
    font-weight: 700;
    outline: none;
    background: ${colors.primary};
    color:${colors.white};
    border: none;
    border-radius: 8px;
    padding: 1em 1.5em;
    margin: 1em 0;
  }

  input{
    font-family: inherit;
    font-size: inherit;
    outline: none;
    background: ${colors.greyVeryLight};
    color:${colors.text};
    border: 1px solid ${colors.quaternary};
    border-radius: 8px;
    padding: 0.5em 1em;
    margin: 0.5em 0;
  }
  
  textarea{
    font-family: inherit;
    font-size: inherit;
    outline: none;
    background: ${colors.greyVeryLight};
    border: 1px solid ${colors.quaternary};
    border-radius: 8px;
    padding: 1em;
    box-sizing: border-box;
    min-height: 8em;
  }

  ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .round{
      background: ${colors.quaternary};
      color: ${colors.textLight};
      border-radius: 8px;
      width: 2em;
      padding: 0.1em;
      display: inline-block;
      text-align: center;
  }
  .round:hover{
      color: ${colors.primary};
  }

  .link{
    text-decoration: underline;
  }
`;

export const listStyle = css`
  /* text-transform: lowercase; */

  ul, ol{
    max-width: 90%;
    margin: 1em auto;
    border: 1px solid ${colors.greyLight};
    box-shadow: 0.5em 0.5em ${colors.greyLight};
    border-radius: 1em;
    overflow: hidden;
    background: ${colors.white};
    color: ${colors.text};
    text-align: left;
    ${mediaqueries[1]}{
      max-width: 70%;
    }
  }

  li{
    padding: 0.7em 1em;
  }
  li:nth-child(even){
    background: ${colors.backgroundAltern};
  }
  li>:nth-child(1):not(.material-icons){
    color: ${colors.text};
    padding-right: 1em;
    font-weight: 700;
  }

  a{
    text-decoration: none;
  }
`;

export const formStyle = css`
  margin: 0 0.5em;
  ${mediaqueries[0]}{
    margin: 0 3em;
  }

  ol {
    list-style: none;
    counter-reset: section-counter;
    margin: 0;
    padding: 0;
  }
  ol li {
    counter-increment: section-counter;
  }

  h3::before {
    content: counter(section-counter);
    background: ${colors.primary};
    color: ${colors.textLight};
    border-radius: 8px;
    width: 2em;
    padding: 0.1em;
    margin-right: 1em;
    display: inline-block;
    text-align: center;
  }

  h3{
      border: 1px solid ${colors.primary};
      border-radius: 8px;
      color:  ${colors.primary};
      margin-bottom: 0.2em;
      padding: 0.8em 0;
  }

  label{
      display: flex;
      flex-direction: column;
      color: ${colors.primary};
      font-weight: 700;
      margin: 0.8em 0;
  }

  li>div>div{
      color: ${colors.error};
      font-weight: 400;
  }
`;