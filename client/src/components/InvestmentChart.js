import React, { useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, ButtonGroup, Button, Typography, Paper } from '@mui/material';

const InvestmentChart = ({ data, buyingPower, onDeposit, onEnableMargin }) => {
  const [timeframe, setTimeframe] = useState('1D');

  return (
    <div className="InvestmentChart">
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginY: 3 }}>
        {['LIVE', '1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
          <Button
            key={tf}
            sx={{ color: timeframe === tf ? '#f06595' : 'text.primary' }}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </Button>
        ))}
      </Box>
      
      <Paper sx={{ marginTop: 2, padding: 2 }}>
        <Typography variant="h6">Buying Power</Typography>
        <Typography variant="body2">Total: ${buyingPower}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="outlined" onClick={onEnableMargin}>Enable margin</Button>
          <Button variant="contained" onClick={onDeposit}>Deposit funds</Button>
        </Box>
      </Paper>
    </div>
  );
};

export default InvestmentChart;
