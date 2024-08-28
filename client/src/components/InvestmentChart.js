<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> Stashed changes
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box, Typography, Paper, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvestmentChart = ({ data }) => {
<<<<<<< Updated upstream
  // Initialize state with local storage or default value
  const [buyingPower, setBuyingPower] = useState(() => {
    const saved = localStorage.getItem('buyingPower');
    return saved ? parseFloat(saved) : 0;
  });
  const [timeframe, setTimeframe] = useState('1D');
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('HSBC');
  const [toAccount, setToAccount] = useState('My Account');

  // Update local storage when buying power changes
  useEffect(() => {
    localStorage.setItem('buyingPower', buyingPower);
  }, [buyingPower]);
=======
  const [timeframe, setTimeframe] = useState('1D');
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('HSBC'); // Default from My Account
  const [toAccount, setToAccount] = useState('My Account'); // Default to Chase
  const [buyingPower, setBuyingPower] = useState(0); // Initial buying power
>>>>>>> Stashed changes

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTransfer = () => {
    if (amount && amount > 0) {
      if (fromAccount === 'My Account') {
<<<<<<< Updated upstream
        setBuyingPower(prev => prev - parseFloat(amount));
      } else if (toAccount === 'My Account') {
=======
        // Transferring from My Account to another bank
        setBuyingPower(prev => prev - parseFloat(amount));
      } else if (toAccount === 'My Account') {
        // Transferring from another bank to My Account
>>>>>>> Stashed changes
        setBuyingPower(prev => prev + parseFloat(amount));
      }
      console.log(`Transferring $${amount} from ${fromAccount} to ${toAccount}`);
      handleClose();
<<<<<<< Updated upstream
      alert('Transfer successful!');
=======
      alert(`You re Rich!`);
>>>>>>> Stashed changes
    } else {
      alert('Please enter a valid amount');
    }
  };

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
          <Button key={tf} sx={{ color: timeframe === tf ? '#f06595' : 'text.primary' }} onClick={() => setTimeframe(tf)}>{tf}</Button>
        ))}
      </Box>

      <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2, marginTop: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Buying Power: ${buyingPower.toFixed(2)}</Typography>
        <Button variant="contained" onClick={handleOpen} sx={{ flexGrow: 0 }}>Transfer funds</Button>
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
          <Button variant="contained" onClick={handleTransfer} fullWidth>Confirm Transfer</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentChart;
