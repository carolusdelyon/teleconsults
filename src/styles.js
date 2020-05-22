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

export const listStyle = css`
    
  ul{
    margin: 1em;
    border: 1px solid ${colors.greyLight};
    box-shadow: 4px 4px ${colors.greyLight};
    border-radius: 1em;
    overflow: hidden;
    background: ${colors.white};
    color: ${colors.text};
    text-align: left;
    font-size: ${fontSizes.small};
  }

  li{
    padding: 1em;
  }
  li:nth-child(even){
    background: ${colors.background};
  }
  li>:nth-child(1){
    color: ${colors.text};
    padding-right: 1em;
    font-weight: 700;
  }

  a{
        text-decoration: none;
  }
`;


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
    max-width: 500px;
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
  h1{
    font-size: 1.5em;
  }
  h2{
    margin: 0.5em 0;
    margin-top: 1em;
  }
  h3{
      text-align: center;
      padding: 0.5em;
      color: ${colors.quaternary};
  }
  h4{
    margin: 0;
    padding: 0;
  }

  button{
    font-family: inherit;
    font-weight: 700;
    font-size: 1em;
    background: ${colors.primary};
    color:${colors.white};
    border: none;
    border-radius: 5px;
    padding: 1em 1.5em;
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

  .round{
      background: ${colors.white};
      color: ${colors.primary};
      border-radius: 5px;
      width: 2em;
      text-align: center;
      display: inline-block;
  }
`;