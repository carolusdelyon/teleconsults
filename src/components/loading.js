// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import { colors } from '../styles';

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Loading = ({ size }) => {
  const style = css`
  height:100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  div{
    border: 16px solid ${colors.tertiary};
    border-radius: 50%;
    border-top: 16px solid ${colors.primary};
    border-bottom: 16px solid ${colors.primary};
    width: ${size ? size : (document.body.clientWidth/4)+'px'};
    height: ${size ? size : (document.body.clientWidth/4)+'px'};
    animation: ${spin} 2s linear infinite;
  }
`;

  // container
  return (<div css={style}>
    {/* the spinner */}
    <div>
    </div>
  </div>)
}

export default Loading;