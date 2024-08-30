import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, Grid, Paper, TextField, Select, MenuItem, FormControl, Card, CardContent, CardMedia } from '@mui/material';
import { ComposedChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { color, padding } from '@mui/system';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const header = 'http://localhost:3000'

const StockPage = ({ onTransactionComplete, buyingPower }) => {
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

  

  // New states for portfolio data
  const [equity, setEquity] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [avgCost, setAvgCost] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const highchartsOptions = {
    chart: {
      type: 'candlestick',
      height: 600,
      //backgroundColor: '#000000'
    },
    rangeSelector: {
      selected: 1,
    },
    navigator: {
      height: 40,  // Adjust the height of the navigator
      top: 530,    // Adjust this value to move the navigator lower
    },
    series: [{
      name: 'Stock Price',
      data: stockData.map(data => [
        new Date(data.date).setHours(0, 0, 0, 0),  // x-axis (time)
        data.open, // open price
        data.high, // high price
        data.low,  // low price
        data.close // close price
      ]),
      color: 'red',    // Color for bearish (close < open)
      upColor: 'green',
      tooltip: {
        valueDecimals: 2
      }
    },
    {
      name: 'Volume',
      type: 'column',
      data: stockData.map(data => ({
        x: new Date(data.date).setHours(0, 0, 0, 0), // x value (timestamp)
        y: data.volume, // y value (volume)
        color: data.close > data.open ? 'green' : 'red', // Conditional color based on price movement
      })),
      yAxis: 1, // Link this series to the second y-axis
      tooltip: {
        valueDecimals: 0
      }
    }],
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%Y-%m-%d' // 只显示日期部分
      }
    },
    yAxis: [{
      title: {
        text: 'Price'
      },
      height:'80%'
    },
    {
      title: {
        text: 'Volume'
      },
      top: '86%',
      height: 60,
      offset: 0,
      lineWidth: 2,
      opposite: true // Position the y-axis on the right side of the chart
    }]
  };

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

    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(`${header}/fin/latestprice/${symbol}`);
        setCurrentPrice(response.data.c); // Assuming the API returns the price as 'price'
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
        setLogoUrl(response.data.logo)
        setWebUrl(response.data.weburl)
      } catch (error) {
        console.error('Error fetching current price:', error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get(`${header}/fin/news/${symbol}`);
        setNewsData(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching current price:', error);
      }
    };

    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get(`${header}/api/dashboard/portfolio/${symbol}`);
        const portfolioData = response.data;


        if (portfolioData) {
          const currentMarketValue = portfolioData.quantity * currentPrice;
          const unrealizedReturn = (currentPrice - portfolioData.purchase_price) * portfolioData.quantity;

          setEquity(currentMarketValue.toFixed(2));
          setTotalReturn(unrealizedReturn.toFixed(2));
          setAvgCost(portfolioData.purchase_price);
          setQuantity(portfolioData.quantity);
        } else {
          // If no data found, set all values to 0
          setEquity(0);
          setTotalReturn(0);
          setAvgCost(0);
          setQuantity(0);
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setEquity(0);
        setTotalReturn(0);
        setAvgCost(0);
        setQuantity(0);
      }
    };

    fetchStockData();
    fetchCurrentPrice();
    fetchDescription();
    fetchNews();
    fetchPortfolioData();

  }, [symbol, currentPrice]);

  const handleBuyClick = async () => {
    try {
      const transactionData = {
        ticker: symbol,
        transaction_type: 'BUY',
        transaction_quantity: parseFloat(amount),
        transaction_price: `${currentPrice}`,
        asset_type: 'Stocks',  // Assuming all buys are stocks for now. Adjust if dynamic.
      };

      const response = await fetch(`${header}/api/dashboard/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert('Buy transaction successful');
        setAmount(''); // Clear the input field
        onTransactionComplete();
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
        transaction_price: `${currentPrice}`,
      };

      const response = await fetch(`${header}/api/dashboard/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        alert('Sell transaction successful');
        setAmount(''); // Clear the input field
        onTransactionComplete();
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
      <Grid container alignItems="center" justifyContent="space-between" style={{marginBottom:"30px"}}>
        <Grid item xs={5}>
          {/* Stock Information Header */}
          <Typography variant="h3">{symbol}</Typography>
          <Typography variant="h5" style={{ color: 'grey' }}> {stockName !== null ? `${stockName}` : 'Loading...'}</Typography>
          <Typography variant="h4" style={{ color: changePrice < 0 ? 'red' : 'green' }}>
            {currentPrice !== null ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
          </Typography>
          <Typography variant="body1" style={{ color: changePrice < 0 ? 'red' : 'green' }}>
            {changePrice !== null && changePercentPrice !== null
              ? `${changePrice < 0 ? '-' : '+'}$${Math.abs(changePrice)} (${changePercentPrice < 0 ? '-' : '+'}${Math.abs(changePercentPrice.toFixed(2))}%) Today`
              : 'Loading...'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
        {logoUrl ? (
          <a href={`${webUrl}`} target="_blank" rel="noopener noreferrer">
            <img
              src={logoUrl}  // Use the actual image URL
              alt={`${symbol} logo`}
              style={{ width: '100%', maxWidth: '200px', maxHeight: '200px' }}
            />
          </a>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
        </Grid>
      </Grid>

      {stockData.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={highchartsOptions}
        />
      ) : (
        <Typography variant="body2">Loading stock data...</Typography>
      )}


      {/* <Box sx={{ display: 'flex', justifyContent: 'space-around', marginY: 3 }}>
        {['LIVE', '1D', '1W', '1M', '3M', '1Y', '5Y'].map((tf) => (
          <Button
            key={tf}
            sx={{ color: timeframe === tf ? '#f06595' : 'text.primary' }}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </Button>
        ))}
      </Box> */}

      {/* Equity and Portfolio Information */}
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Your Equity</Typography>
            <Typography variant="h4">${equity}</Typography>
            <Typography variant="body1">Total Return: ${totalReturn}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Your Average Cost / Share</Typography>
            <Typography variant="h4">${avgCost}</Typography>
            <Typography variant="body1">Quantity Held: {quantity}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Trading Panel */}
      <Box sx={{ marginTop: 4 }}>
        <Grid container spacing={2} >
          <Grid item xs={6} >
            <Paper sx={{ padding: 3, height: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <h2 style={{'marginTop':"-8px"}}>Trade</h2>
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
                  <Button
                    fullWidth
                    sx={{ bgcolor: '#EE3524', color: 'white', marginTop: 2 }}
                    onClick={handleBuyClick}
                  >
                    Buy
                  </Button>

                  <Typography sx={{ marginTop: 2 }}>Available: ${buyingPower.toFixed(2)}</Typography>
                  
                  <Button
                    fullWidth
                    sx={{ border: '1px solid #EE3524', color: '#EE3524', marginTop: 2 }}
                    onClick={handleSellClick}
                  >
                    Sell
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper sx={{ padding: 2, height: 400, overflowY: 'auto' }}>
              <h2 style={{ marginTop: "0px" }}>News</h2>
              {newsData.map((newsItem, index) => (
                <a href={newsItem.url} target="_blank" rel="noopener noreferrer" key={index} style={{ textDecoration: 'none' }}>
                  <Card sx={{ display: 'flex', marginBottom: 2 }} style={{'height':"100px"}}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100 }}
                      image={newsItem.image}
                      alt={`Image for ${newsItem.headline}`}
                    />
                    <CardContent>
                      <Typography variant="h7">
                      {newsItem.headline.length > 60 ? `${newsItem.headline.substring(0, 60)}...` : newsItem.headline}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                      {newsItem.summary.length > 100 ? `${newsItem.summary.substring(0, 200)}...` : newsItem.summary}
                      </Typography>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </Paper>
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default StockPage;