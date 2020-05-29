/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from "react";
import { colors } from '../styles';

// Main sections of forms, plegables
const Accordion = ({ title, children, customcss }) => {
    const [isOpen, setOpen] = useState(false);

    // used instead of css to get the exact needed
    // height with `scrollHeight`
    function updateHeight({ target }) {
        // the expandable container itself
        const nextSibling = target.nextSibling;
        if(!isOpen){
            // 100px extra in case of expansion
            nextSibling.style.maxHeight = (nextSibling.scrollHeight + 100) + "px";
        }else{
            nextSibling.style.maxHeight = 0;
        }
        setOpen(!isOpen);
    }

    return (
        <li css={css`
                h3, &>div{
                    transition: 0.5s;
                    overflow: hidden;
                }
                ${isOpen && `h3{
                    background: ${colors.quaternary};
                    color: ${colors.textLight};
                }`}
                ${!isOpen && `div{
                    max-height: 0;
                };`}                
            `}>
            <h3 onClick={updateHeight}>
                {title}
            </h3>
            <div css={customcss}>
                {children}
            </div>
        </li>
    );
}

export default Accordion;