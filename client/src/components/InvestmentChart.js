import React from 'react';
import { LineChart, Line } from 'recharts';

const InvestmentChart = ({ data }) => (
  <div className="InvestmentChart">
    <LineChart width={800} height={400} data={data}>
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  </div>
);

export default InvestmentChart;
