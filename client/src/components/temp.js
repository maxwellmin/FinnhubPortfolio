import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const data = [
  { name: "Stocks & Options", value: 170.11, color: "#00C49F" },
  { name: "Cryptocurrencies", value: 71.03, color: "#FFBB28" },
  { name: "Individual Cash", value: 0.02, color: "#FF8042" }
];

const Portfolio = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Total Portfolio Value: $241.16
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" gutterBottom>Stocks & options: $170.11 (70.54%)</Typography>
          <Typography variant="h6" gutterBottom>Cryptocurrencies: $71.03 (29.45%)</Typography>
          <Typography variant="h6" gutterBottom>Individual cash: $0.02 (0.01%)</Typography>
        </Box>
        <PieChart width={400} height={400}>
          <Pie dataKey="value" data={data} cx={200} cy={200} outerRadius={120} fill="#8884d8" label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Box>
    </Box>
  );
};

export default Portfolio;
