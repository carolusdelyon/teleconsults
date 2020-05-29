/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Fragment } from 'react';
import { colors } from '../styles';
import { Field } from 'formik';

const style = css`
    min-width: 20em;
    border: 1px solid ${colors.quaternary};
`;

function DataList({ name, onInput, children }) {
    return (
        <Fragment>
            <Field
                list={name+'list'} name={name} id={name}
                css={style}
                onClick={({ target }) => target.value = null}
                onInput={onInput}
            />
            <datalist id={name+'list'}>
                {/* options */}
                {children}
            </datalist>
        </Fragment>
    );
}

export default DataList;