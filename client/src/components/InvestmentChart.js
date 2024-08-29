import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box, Typography, Paper, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvestmentChart = ({ data }) => {
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

      <Paper sx={{ display: 'flex', flexDirection: 'column', padding: 2, marginTop: 2 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>My Account</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h7">Available: ${buyingPower.toFixed(2)}</Typography>
          <Button variant="contained" onClick={handleOpen}>Transfer funds</Button>
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
          <Button variant="contained" onClick={handleTransfer} fullWidth>Confirm Transfer</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentChart;


// import React, { useState } from 'react';
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, ButtonGroup, Button, Typography, Paper } from '@mui/material';

// const InvestmentChart = ({ data, buyingPower, onDeposit, onEnableMargin }) => {
//   const [timeframe, setTimeframe] = useState('1D');

//   return (
//     <div className="InvestmentChart">
      
//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
//         </LineChart>
//       </ResponsiveContainer>

//       <Box sx={{ display: 'flex', justifyContent: 'space-around', marginY: 3 }}>
//         {['LIVE', '1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
//           <Button
//             key={tf}
//             sx={{ color: timeframe === tf ? '#f06595' : 'text.primary' }}
//             onClick={() => setTimeframe(tf)}
//           >
//             {tf}
//           </Button>
//         ))}
//       </Box>
      
//       <Paper sx={{ marginTop: 2, padding: 2 }}>
//         <Typography variant="h6">Buying Power</Typography>
//         <Typography variant="body2">Total: ${buyingPower}</Typography>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
//           <Button variant="outlined" onClick={onEnableMargin}>Enable margin</Button>
//           <Button variant="contained" onClick={onDeposit}>Deposit funds</Button>
//         </Box>
//       </Paper>
//     </div>
//   );
// };

// export default InvestmentChart;
