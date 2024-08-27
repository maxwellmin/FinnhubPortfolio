import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Grid } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BalanceDisplay from './components/BalanceDisplay';
import InvestmentChart from './components/InvestmentChart';
import PortfolioSummary from './components/PortfolioSummary';
import StockPage from './components/StockPage'; // Import the StockPage component
import Portfolio from './components/Portfolio'; // Import the new Portfolio component

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [investmentItems, setInvestmentItems] = useState([]);

  const balanceData = {
    total: '246.03',
    todayChange: '+0.09',
  };
  
  const chartData = [
    { name: 'day1', value: 240 },
    { name: 'day2', value: 230 },
    { name: 'day3', value: 250 },
    { name: 'day4', value: 220 },
    { name: 'day5', value: 290 },
    { name: 'day6', value: 265 },
    { name: 'day7', value: 280 },
    { name: 'day8', value: 275 },
    { name: 'day9', value: 260 },
    { name: 'day10', value: 285 },
    { name: 'day11', value: 290 },
    { name: 'day12', value: 300 },
    { name: 'day13', value: 310 },
    { name: 'day14', value: 305 },
    { name: 'day15', value: 320 },
    { name: 'day16', value: 330 },
    { name: 'day17', value: 340 },
    { name: 'day18', value: 335 },
    { name: 'day19', value: 345 },
    { name: 'day20', value: 350 },
    { name: 'day21', value: 360 },
    { name: 'day22', value: 370 },
    { name: 'day23', value: 365 },
    { name: 'day24', value: 355 },
    { name: 'day25', value: 345 },
    { name: 'day26', value: 350 },
    { name: 'day27', value: 360 },
    { name: 'day28', value: 370 },
    { name: 'day29', value: 380 },
    { name: 'day30', value: 390 }
  ];

<<<<<<< HEAD
  // const investmentItems = [
  //   { name: 'ETH', shares: 0.001624, price: 2735.43 },
  //   { name: 'BTC', shares: 0.00105957, price: 63702.90 },
  //   { name: 'AAPL', shares: 10.234, price: 145.32 },
  //   { name: 'TSLA', shares: 5.67, price: 732.23 },
  //   { name: 'AMZN', shares: 2.45, price: 3342.88 },
  //   { name: 'GOOGL', shares: 3.89, price: 2810.92 },
  //   { name: 'MSFT', shares: 8.56, price: 299.12 },
  //   { name: 'NFLX', shares: 1.23, price: 527.34 },
  //   { name: 'FB', shares: 4.78, price: 345.23 },
  //   { name: 'NVDA', shares: 6.12, price: 226.72 },
  //   { name: 'DIS', shares: 7.78, price: 178.52 },
  //   { name: 'CSCO', shares: 18.45, price: 55.44 },
  //   { name: 'ORCL', shares: 14.23, price: 85.92 },
  //   { name: 'AMD', shares: 16.78, price: 102.34 },
  //   { name: 'NFLX', shares: 1.98, price: 512.23 },
  //   { name: 'SPOT', shares: 6.89, price: 238.56 },
  //   { name: 'UBER', shares: 12.34, price: 42.67 },
  // ];
=======
  // Fetch portfolio data from backend
  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard/portfolio');
        const data = await response.json();
        
        console.log("Fetched data:", data);

        const formattedItems = data.map(item => ({
          name: item.ticker,
          shares: item.quantity,
          price: item.purchase_price,
        }));

        setInvestmentItems(formattedItems);  // Update state with fetched data
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    }

    fetchPortfolioData();
  }, []);
>>>>>>> 2812957fd8266d29e2bbb97a38b161113ba7c119

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            <Route path="/" element={
              <Grid container spacing={2} sx={{ flex: 1, padding: '16px' }}>
                <Grid item xs={9}>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '8px',
                      padding: '16px',
                      overflowY: 'auto',
                      bgcolor: theme.palette.background.paper,
                    }}
                  >
                    <BalanceDisplay total={balanceData.total} todayChange={balanceData.todayChange} />
                    <InvestmentChart data={chartData} />
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '8px',
                      padding: '16px',
                      bgcolor: theme.palette.background.paper,
                      overflowY: 'auto',
                      height: '100%',
                    }}
                  >
                    <h3>Portfolio Profile</h3>
                    <PortfolioSummary items={investmentItems} />
                  </Box>
                </Grid>
              </Grid>
            }/>
            <Route path="/stock/:symbol" element={<StockPage />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;