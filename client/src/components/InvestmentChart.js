import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box, Typography, Paper, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

const InvestmentChart = ({ buyingPower, setBuyingPower }) => {
  // Initialize state with local storage or default value
  // const [buyingPower, setBuyingPower] = useState(() => {
  //   const saved = localStorage.getItem('buyingPower');
  //   return saved ? parseFloat(saved) : 0;
  // });
  const [timeframe, setTimeframe] = useState('1D');
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('HSBC');
  const [toAccount, setToAccount] = useState('My Account');
  const [chartData, setChartData] = useState([]);

  // Update local storage when buying power changes
  // useEffect(() => {
  //   localStorage.setItem('buyingPower', buyingPower);
  // }, [buyingPower]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Fetch your portfolio data
        const portfolioResponse = await axios.get('http://localhost:3000/api/dashboard/portfolio');
        const portfolioData = portfolioResponse.data;

        let chartData = [];

        for (let asset of portfolioData) {
          const { ticker, purchase_price, quantity } = asset;

          // Fetch historical data for each ticker
          const historicalResponse = await axios.get(`http://localhost:3000/fin/yahoo1/historical/timeRange/${ticker}?start=2024-01-01&end=2024-08-30`);
          const historicalData = historicalResponse.data;

          historicalData.forEach((dayData) => {
            const { date, close } = dayData;

            // Calculate daily return
            const dailyReturn = ((close - purchase_price) * quantity).toFixed(2);

            // Find if date already exists in chartData
            let existingDay = chartData.find(day => day.name === date);

            if (existingDay) {
              existingDay.value = (parseFloat(existingDay.value) + parseFloat(dailyReturn)).toFixed(2);
            } else {
              chartData.push({ name: date, value: dailyReturn });
            }
          });
        }

        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTransfer = () => {
    if (amount && amount > 0) {
      if (fromAccount === 'My Account') {
        setBuyingPower(prev => prev - parseFloat(amount));
      } else if (toAccount === 'My Account') {
        setBuyingPower(prev => prev + parseFloat(amount));
      }
      console.log(`Transferring $${amount} from ${fromAccount} to ${toAccount}`);
      handleClose();
      alert('Transfer successful!');
    } else {
      alert('Please enter a valid amount');
    }
  };

  // console.log(`max: ${chartData.max}`);
  // console.log(chartData.min);


  return (
    <div className="InvestmentChart">
      <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
        <Typography variant="h6" component="div">
          Year-to-Date Portfolio Return
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        {chartData.length > 0 ? (
          (() => {
            const dataMax = Math.max(...chartData.map(d => d.value));
            const dataMin = Math.min(...chartData.map(d => d.value));

            // Calculate the range and define the number of ticks
            const range = dataMax - dataMin;
            const numTicks = 5;
            const tickInterval = Math.ceil(range / numTicks);

            // Adjust the Y-axis max and min values to be multiples of the tick interval
            const yAxisMax = Math.ceil(dataMax / tickInterval) * tickInterval;
            const yAxisMin = Math.floor(dataMin / tickInterval) * tickInterval;

            return (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tickFormatter={(date) => dayjs(date).format('MMM DD')} // Format the date as "Jan 29"
                  interval="preserveEnd"  // Ensure the interval captures the ends of the range
                  ticks={chartData.filter((_, index) => index % Math.floor(chartData.length / 7) === 0).map(d => d.name)} // Show approx 8 ticks
                />
                <YAxis domain={[yAxisMin - 100, yAxisMax + 100]} tickCount={numTicks + 1} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            );
          })()
        ) : (
          <Typography variant="body2">Loading chart data...</Typography>
        )}
      </ResponsiveContainer>

      <Paper sx={{ display: 'flex', flexDirection: 'column', padding: 2, marginTop: 2 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>My Account</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h7">Available: ${buyingPower.toFixed(2)}</Typography>
          <Button variant="contained" sx={{bgcolor:'#EE3524', '&:hover': {bgcolor:'#EE3524'}}} onClick={handleOpen} >Transfer Funds</Button>
        </Box>
      </Paper>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Transfer Money</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ my: 2 }}>
            <TextField
              label="Amount"
              type="number"
              variant="outlined"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="from-account-label">From</InputLabel>
            <Select
              labelId="from-account-label"
              value={fromAccount}
              label="From"
              onChange={e => setFromAccount(e.target.value)}
            >
              <MenuItem value="My Account">My Account</MenuItem>
              <MenuItem value="HSBC">HSBC</MenuItem>
              <MenuItem value="Chase">Chase</MenuItem>
              <MenuItem value="Bank of America">Bank of America</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="to-account-label">To</InputLabel>
            <Select
              labelId="to-account-label"
              value={toAccount}
              label="To"
              onChange={e => setToAccount(e.target.value)}
            >
              <MenuItem value="My Account">My Account</MenuItem>
              <MenuItem value="HSBC">HSBC</MenuItem>
              <MenuItem value="Chase">Chase</MenuItem>
              <MenuItem value="Bank of America">Bank of America</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleTransfer} fullWidth sx={{bgcolor:'#EE3524', '&:hover': {bgcolor:'#EE3524'}}}>Confirm Transfer</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentChart;