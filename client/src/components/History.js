import React from 'react';
import { Typography, Box, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';

const History = () => {
  const transactions = [
    { date: 'Jul 15', description: 'Deposit to individual account from HSBC', amount: '+$5.00' },
    { date: 'Jul 15', description: 'Deposit to individual account from HSBC', amount: '+$10.00' },
    { date: 'Jul 15', description: 'Deposit to individual account from HSBC', amount: '+$10.00' },
    { date: 'Jul 15', description: 'Deposit to individual account from HSBC', amount: '+$20.00' },
    // Add more transactions as needed
  ];

  return (
    <Box sx={{ padding: 10, minHeight: '100vh' }}>
      {/* Page Header */}
      <Typography variant="h4" sx={{ marginBottom: 4 }}>User Name</Typography>

      <Grid container spacing={4}>
        {/* Transaction List */}
        <Grid item xs={8}>
          {transactions.map((transaction, index) => (
            <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="body1">{transaction.description}</Typography>
              <Typography variant="body2" color="textSecondary">{transaction.date}</Typography>
              <Typography variant="h6" sx={{ textAlign: 'right', color: transaction.amount.startsWith('+') ? 'green' : 'inherit' }}>
                {transaction.amount}
              </Typography>
              {transaction.details && <Typography variant="body2" color="textSecondary">{transaction.details}</Typography>}
            </Paper>
          ))}
        </Grid>

        {/* Refine Results Section */}
        {/* <Grid item xs={4}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Refine Results</Typography>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Account</InputLabel>
              <Select defaultValue="All">
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Savings">Savings</MenuItem>
                <MenuItem value="Checking">Checking</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select defaultValue="All">
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Deposit">Deposit</MenuItem>
                <MenuItem value="Withdrawal">Withdrawal</MenuItem>
                <MenuItem value="Purchase">Purchase</MenuItem>
              </Select>
            </FormControl>

            <Button fullWidth sx={{ bgcolor: 'green', color: 'white' }}>
              Search
            </Button>
          </Paper>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default History;
