/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Link, useRouteMatch } from "react-router-dom";
import { colors, listStyle } from '../styles';
import { getHoursSinceDateJoomla } from '../utils';

// limit on preview description
const limitWords = 500;

export default function ConsultTile({ consult, borderColor, disabled }) {
    let match = useRouteMatch();
    const hoursSince = getHoursSinceDateJoomla(consult.date);
    const daysSince = Math.floor(hoursSince / 24);
    return (
        <li
            css={css`
                ${listStyle}
                ${borderColor && `ul{
                    border: 1px solid ${borderColor};
                }`}
                
                ${disabled && `li>span{
                    color: ${colors.grey};
                }`}
            `}
        >
            <Link to={disabled ? "#" : `${match.url}/${consult.id}`}>
                <ul>
                    <li>
                        <span>Enviada</span>
                        <span>{consult.date}
                        </span>
                        {/* show time since consult, if has not been ansewered */}
                        {!consult.dateAnswered &&
                            <span className="round" css={
                                css`
                                    display: inline;
                                    margin-left: 1em;
                                    padding: 0 0.5em;
                                `
                            }>
                                hace {hoursSince} horas
                                ({daysSince} días)
                            </span>}
                    </li>
                    {consult.specialistName && <li>
                        <span>Asignada a</span>
                        <span>{consult.specialistName}</span>
                    </li>}
                    <li>
                        <span>Origen</span>
                        <span>{consult.city} / {consult.province}</span>
                    </li>
                    <li>
                        <span>Unidad</span>
                        <span>{consult.operatingUnit}</span>
                    </li>
                    <li>
                        <span>Motivo</span>
                        <span>{consult.reason.length > limitWords ?
                            `${consult.reason.substring(0, limitWords)}...`
                            : consult.reason}</span>
                    </li>
                </ul>
            </Link>
        </li>
    );
}