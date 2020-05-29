import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import React from 'react';
import {colors} from '../styles';

const Chart = ({data}) =>
<BarChart width={document.body.clientWidth * 0.6} height={document.body.clientHeight * 0.15} data={data}>
    <Bar fill={colors.quaternary} dataKey="count" label={{ position: 'inside' }} />
    <XAxis dataKey="name" />
    <YAxis allowDecimals={false} hide={true} domain={[0, 'dataMax']} />
</BarChart>

export default Chart;