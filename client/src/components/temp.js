import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, Grid, Paper, TextField, Select, MenuItem, FormControl, Card, CardContent, CardMedia } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const header = 'http://localhost:3000';

const StockPage = ({ onTransactionComplete }) => {  // Added prop for callback
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);
  const [timeframe, setTimeframe] = useState('1D');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [changePrice, setChangePrice] = useState(null);
  const [changePercentPrice, setChangePercentPrice] = useState(null);
  const [stockName, setStockName] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [webUrl, setWebUrl] = useState(null);
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`${header}/fin/yahoo1/historical/${symbol}`, {
          params: { range: '1y', interval: '1d' },
        });
        setStockData(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(`${header}/fin/latestprice/${symbol}`);
        setCurrentPrice(response.data.c);
        setChangePrice(response.data.d);
        setChangePercentPrice(response.data.dp);
      } catch (error) {
        console.error('Error fetching current price:', error);
      }
    };

    const fetchDescription = async () => {
      try {
        const response = await axios.get(`${header}/fin/companydesp/${symbol}`);
        setStockName(response.data.name); 
        setLogoUrl(response.data.logo);
        setWebUrl(response.data.weburl);
      } catch (error) {
        console.error('Error fetching company description:', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get(`${header}/fin/news/${symbol}`);
        setNewsData(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchStockData();
    fetchCurrentPrice();
    fetchDescription();
    fetchNews();

  }, [symbol]);

  const handleTransaction = async (transactionType) => {
    try {
      const transactionData = {
        ticker: symbol,
        transaction_type: transactionType,
        transaction_quantity: parseFloat(amount),
        transaction_price: currentPrice,
        asset_type: 'Stock',
      };

      const response = await fetch(`${header}/api/dashboard/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert(`${transactionType} transaction successful`);
        setAmount('');
        onTransactionComplete(); // Call the callback to refresh portfolio data
      } else {
        const errorData = await response.json();
        alert(`Transaction failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Error processing ${transactionType.toLowerCase()} transaction:`, error);
    }
  };

  return (
    <Box sx={{ padding: 4, minHeight: '100vh' }}>
      <Grid container alignItems="center" justifyContent="space-between" style={{ marginBottom: "30px" }}>
        <Grid item xs={5}>
          <Typography variant="h3">{symbol}</Typography>
          <Typography variant="h5" style={{ color: 'grey' }}>{stockName || 'Loading...'}</Typography>
          <Typography variant="h4" style={{ color: changePrice < 0 ? 'red' : 'green' }}>
            {currentPrice ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
          </Typography>
          <Typography variant="body1" style={{ color: changePrice < 0 ? 'red' : 'green' }}>
            {changePrice && changePercentPrice ? `${changePrice < 0 ? '-' : '+'}$${Math.abs(changePrice)} (${changePercentPrice < 0 ? '-' : '+'}${Math.abs(changePercentPrice.toFixed(2))}%) Today` : 'Loading...'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {logoUrl ? (
            <a href={webUrl} target="_blank" rel="noopener noreferrer">
              <img src={logoUrl} alt={`${symbol} logo`} style={{ width: '100%', maxWidth: '200px', maxHeight: '200px' }} />
            </a>
          ) : (
            <Typography variant="body1">Loading...</Typography>
          )}
        </Grid>
      </Grid>
      {/* ... Remaining parts of the component ... */}
    </Box>
  );
};

export default StockPage;
