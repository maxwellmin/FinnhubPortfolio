import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { format } from 'date-fns';

const History = () => {
  const [transactions, setTransaction] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [tickerFilter, setTickerFilter] = useState('');
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard/transaction")
      .then(response => response.json())
      .then(data => {
        // Sort transactions by time (newest first)
        const sortedTransactions = data.sort((a, b) => new Date(b.transaction_time) - new Date(a.transaction_time));
        setTransaction(sortedTransactions);

        // Extract unique tickers for filter options
        const uniqueTickers = [...new Set(sortedTransactions.map(t => t.ticker))];
        setTickers(uniqueTickers);
      })
      .catch(error => console.error("error fetching", error));
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...transactions];
    if (typeFilter) {
      result = result.filter(transaction => transaction.transaction_type === typeFilter);
    }
    if (tickerFilter) {
      result = result.filter(transaction => transaction.ticker === tickerFilter);
    }
    setFilteredTransactions(result);
  }, [typeFilter, tickerFilter, transactions]);

  return (
    <Box sx={{ padding: 10, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        User Name
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="BUY">Buy</MenuItem>
              <MenuItem value="SELL">Sell</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Ticker</InputLabel>
            <Select
              value={tickerFilter}
              onChange={(e) => setTickerFilter(e.target.value)}
              label="Ticker"
            >
              <MenuItem value="">All</MenuItem>
              {tickers.map((ticker, index) => (
                <MenuItem key={index} value={ticker}>{ticker}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          {filteredTransactions.length > 0 ? (
            <List>
              {filteredTransactions.map((transaction, index) => (
                <Paper key={index} sx={{ marginBottom: 2, padding: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={`${transaction.transaction_type} ${transaction.ticker} ${transaction.transaction_quantity} shares at price $${transaction.transaction_price}`}
                      secondary={format(new Date(transaction.transaction_time), 'MMM dd, HH:mm:ss')}
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="h6" color={transaction.transaction_type === 'BUY' ? 'green' : 'red'}>
                        {transaction.transaction_type === 'BUY' ? '+' : '-'}${transaction.transaction_value}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          ) : (
            <Typography>No transactions found.</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default History;
