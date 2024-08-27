import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, Grid, Paper, TextField, Select, MenuItem, FormControl } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const header = 'http://localhost:3000'

const StockPage = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);



  // const fetchStockData = async () => {
  //   const response = await fetch(`https://api.example.com/stock/${symbol}/history`);
  //   const data = await response.json();
  
  //   const formattedData = data.map(item => ({
  //     date: item.date,
  //     close: item.close
  //   }));
  
  //   setStockData(formattedData);
  // };
  

  // useEffect(() => {
  //   // Replace this with your actual API call
  //   const fetchStockData = async () => {
  //     // Mocked data for demonstration purposes
  //     const mockData = [
  //       { date: '2023-08-01', close: 145.32 },
  //       { date: '2023-08-02', close: 146.67 },
  //       { date: '2023-08-03', close: 144.15 },
  //       { date: '2023-08-04', close: 148.89 },
  //       { date: '2023-08-05', close: 150.23 },
  //       // Add more data points as needed
  //     ];

  //     // Simulate API call delay
  //     setTimeout(() => setStockData(mockData), 500);
  //   };

  //   fetchStockData();
  // }, [symbol]);
  const [timeframe, setTimeframe] = useState('1D');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState(2679.71);

  useEffect(() => {
    // Replace this with your actual API call
    const fetchStockData = async () => {
      // Mocked data for demonstration purposes
      try {
        const response = await axios.get(`${header}/fin/yahoo1/historical/${symbol}`, {
          params: {
            range: '1y', // You can adjust the range as needed
            interval: '1d', // You can adjust the interval as needed
          },
        });
        console.log("type of response: ", typeof(response.data),response.data)

        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }


    };

    fetchStockData();
  }, [symbol]);

  const handleBuyClick = async () => {
    try {
      const transactionData = {
        ticker: symbol,
        transaction_type: 'BUY',
        transaction_quantity: parseFloat(amount),
        transaction_price: price,
      };

      const response = await fetch('http://localhost:3000/api/dashboard/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert('Buy transaction successful');
        setAmount(''); // Clear the input field
      } else {
        const errorData = await response.json();
        alert(`Transaction failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error processing buy transaction:', error);
    }
  };

  const handleSellClick = async () => {
    try {
      const transactionData = {
        ticker: symbol,
        transaction_type: 'SELL',
        transaction_quantity: parseFloat(amount),
        transaction_price: price,
      };

      const response = await fetch('http://localhost:3000/api/dashboard/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert('Sell transaction successful');
        setAmount(''); // Clear the input field
      } else {
        const errorData = await response.json();
        alert(`Transaction failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error processing sell transaction:', error);
    }
  };

  return (
    <Box sx={{ padding: 4, minHeight: '100vh' }}>
      {/* Stock Information Header */}
      <Typography variant="h3">{symbol}</Typography>
      <Typography variant="h4">${price}</Typography> {/* Price is displayed */}
      <Typography variant="body1" color="error">
        -$43.12 (-1.58%) Today
      </Typography>

      {/* Chart Section */}
      {stockData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400} sx={{ marginTop: 4 }}>
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#f06595" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body2">Loading stock data...</Typography>
      )}

      {/* Timeframe Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginY: 3 }}>
        {['LIVE', '1D', '1W', '1M', '3M', '1Y', '5Y'].map((tf) => (
          <Button
            key={tf}
            sx={{ color: timeframe === tf ? '#f06595' : 'text.primary' }}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </Button>
        ))}
      </Box>

      {/* Trading Panel */}
      <Box sx={{ marginTop: 4 }}>
        <Paper sx={{ padding: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value={'USD'}>USD</MenuItem>
                  <MenuItem value={'CNY'}>CNY</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            sx={{ bgcolor: '#f06595', color: 'white', marginTop: 2 }}
            onClick={handleBuyClick}
          >
            Buy
          </Button>

          <Typography sx={{ marginTop: 2 }}>Available: $0.02</Typography>

          <Button
            fullWidth
            sx={{ border: '1px solid #f06595', color: '#f06595', marginTop: 2 }}
            onClick={handleSellClick}
          >
            Sell
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default StockPage;
