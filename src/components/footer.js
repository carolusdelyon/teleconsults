/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Navigator from './navigator';

const style = css`
    position: sticky;
    bottom: 0;
    width: 100%;
`;

export default function Pages(props) {
  return (
      <footer css={style}>
          <Navigator />
      </footer>
  );
}