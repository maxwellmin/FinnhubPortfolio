// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Typography, Box, Button, Grid, Paper, TextField, Select, MenuItem, FormControl } from '@mui/material';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { color, padding } from '@mui/system';

// const header = 'http://localhost:3000'

// const StockPage = () => {
//   const { symbol } = useParams();
//   const [stockData, setStockData] = useState([]);
//   const [timeframe, setTimeframe] = useState('1D');
//   const [amount, setAmount] = useState('');
//   const [currency, setCurrency] = useState('USD');
//   const [currentPrice, setCurrentPrice] = useState(null);
//   const [changePrice, setChangePrice] = useState(null);
//   const [changePercentPrice, setChangePercentPrice] = useState(null);
//   const [stockName, setStockName] = useState(null);
//   const [logoUrl, setLogoUrl] = useState(null);
//   const [webUrl, setWebUrl] = useState(null);
//   const [buyingPower, setBuyingPower] = useState(() => {
//     const saved = localStorage.getItem('buyingPower');
//     return saved ? parseFloat(saved) : 0;
//   });

//   useEffect(() => {
//     // Initial data fetching
//     const fetchData = async () => {
//       try {
//         const responses = await Promise.all([
//           axios.get(`${header}/fin/yahoo1/historical/${symbol}`, { params: { range: '1y', interval: '1d' }}),
//           axios.get(`${header}/fin/latestprice/${symbol}`),
//           axios.get(`${header}/fin/companydesp/${symbol}`)
//         ]);
        
//         setStockData(responses[0].data);
//         setCurrentPrice(responses[1].data.c);
//         setChangePrice(responses[1].data.d);
//         setChangePercentPrice(responses[1].data.dp);
//         setStockName(responses[2].data.name);
//         setLogoUrl(responses[2].data.logo);
//         setWebUrl(responses[2].data.weburl);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [symbol]);

//   const updateBuyingPower = (newBuyingPower) => {
//     setBuyingPower(newBuyingPower);
//     localStorage.setItem('buyingPower', newBuyingPower);
//   };

//   const handleBuyClick = async () => {
//     const cost = currentPrice * parseFloat(amount);
//     if (buyingPower >= cost) {
//       updateBuyingPower(buyingPower - cost);
//       alert('Buy transaction successful');
//       setAmount(''); // Clear the input field
//     } else {
//       alert("Not enough buying power");
//     }
//   };

//   const handleSellClick = async () => {
//     const gain = currentPrice * parseFloat(amount);
//     updateBuyingPower(buyingPower + gain);
//     alert('Sell transaction successful');
//     setAmount(''); // Clear the input field
//   };

//   return (
//     <Box sx={{ padding: 4, minHeight: '100vh' }}>
//       <Grid container alignItems="center" justifyContent="space-between" style={{marginBottom:"30px"}}>
//         <Grid item xs={5}>
//           <Typography variant="h3">{symbol}</Typography>
//           <Typography variant="h5" style={{ color: 'grey' }}>{stockName || 'Loading...'}</Typography>
//           <Typography variant="h4" style={{ color: changePrice < 0 ? 'red' : 'green' }}>
//             {currentPrice ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
//           </Typography>
//           <Typography variant="body1" style={{ color: changePrice < 0 ? 'red' : 'green' }}>
//             {changePrice !== null && changePercentPrice !== null ?
//               `${changePrice < 0 ? '-' : '+'}$${Math.abs(changePrice)} (${changePercentPrice < 0 ? '-' : '+'}${Math.abs(changePercentPrice.toFixed(2))}%) Today` :
//               'Loading...'}
//           </Typography>
//         </Grid>
//         <Grid item xs={1}>
//           {logoUrl ? (
//             <a href={webUrl} target="_blank" rel="noopener noreferrer">
//               <img src={logoUrl} alt={`${symbol} logo`} style={{ width: '100%', maxWidth: '200px', maxHeight: '200px' }} />
//             </a>
//           ) : (
//             <Typography variant="body1">Loading...</Typography>
//           )}
//         </Grid>
//       </Grid>

//       {stockData.length > 0 ? (
//         <ResponsiveContainer width="100%" height={400} sx={{ marginTop: 4 }}>
//           <LineChart data={stockData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Line type="monotone" dataKey="close" stroke={changePrice < 0 ? '#f44336' : '#4caf50'} activeDot={{ r: 8 }} />
//           </LineChart>
//         </ResponsiveContainer>
//       ) : (
//         <Typography variant="body2">Loading stock data...</Typography>
//       )}

//       <Box sx={{ display: 'flex', justifyContent: 'space-around', marginY: 3 }}>
//         {['LIVE', '1D', '1W', '1M', '3M', '1Y', '5Y'].map((tf) => (
//           <Button key={tf} sx={{ color: timeframe === tf ? '#f06595' : 'text.primary' }} onClick={() => setTimeframe(tf)}>
//             {tf}
//           </Button>
//         ))}
//       </Box>

//       <Box sx={{ marginTop: 4 }}>
//         <Paper sx={{ padding: 3 }}>
//           <FormControl fullWidth sx={{ marginBottom: 2 }}>
//             <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
//               <MenuItem value={'USD'}>USD</MenuItem>
//               <MenuItem value={'CNY'}>CNY</MenuItem>
//             </Select>
//           </FormControl>

//           <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />

//           <Button fullWidth sx={{ bgcolor: '#f06595', color: 'white', marginTop: 2 }} onClick={handleBuyClick}>
//             Buy
//           </Button>

//           <Typography sx={{ marginTop: 2 }}>Available: ${buyingPower.toFixed(2)}</Typography>

//           <Button fullWidth sx={{ border: '1px solid #f06595', color: '#f06595', marginTop: 2 }} onClick={handleSellClick}>
//             Sell
//           </Button>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default StockPage;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, Grid, Paper, TextField, Select, MenuItem, FormControl } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { color, padding } from '@mui/system';


const header = 'http://localhost:3000'

const StockPage = () => {
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

    fetchStockData();
    fetchCurrentPrice();
    fetchDescription();
  }, [symbol]);

  const handleBuyClick = async () => {
    try {
      const transactionData = {
        ticker: symbol,
        transaction_type: 'BUY',
        transaction_quantity: parseFloat(amount),
        transaction_price: `${currentPrice}`,
        asset_type: 'Stock',  // Assuming all buys are stocks for now. Adjust if dynamic.
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
        transaction_price: `${currentPrice}`,
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

      {/* Chart Section */}
      {stockData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400} sx={{ marginTop: 4 }}>
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke={changePrice < 0 ? '#f44336': '#4caf50'} activeDot={{ r: 8 }} />
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

       {/* Equity and Portfolio Information */}
       <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Your Equity</Typography>
            <Typography variant="h4">$4.35</Typography>
            <Typography variant="body2">Today's Return: -$0.07 (-1.58%)</Typography>
            <Typography variant="body2">Total Return: -$1.47 (-25.23%)</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Your average cost</Typography>
            <Typography variant="h4">$3,583.74</Typography>
            <Typography variant="body2">Quantity: 0.001624</Typography>
            <Typography variant="body2">Portfolio diversity: 1.80%</Typography>
          </Paper>
        </Grid>
      </Grid>

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
