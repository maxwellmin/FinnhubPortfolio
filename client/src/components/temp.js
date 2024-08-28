import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Grid, ButtonGroup, Button, Typography, Paper } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BalanceDisplay from './components/BalanceDisplay';
import InvestmentChart from './components/InvestmentChart';
import PortfolioSummary from './components/PortfolioSummary';
import StockPage from './components/StockPage'; 
import Portfolio from './components/Portfolio'; 
import Login from './components/Login'; 
import History from './components/History';

function InvestmentOptions({ buyingPower, onDeposit, onEnableMargin }) {
  return (
    <Paper sx={{ marginTop: 2, padding: 2 }}>
      <Typography variant="h6">Buying Power</Typography>
      <Typography variant="body2">Individual cash: ${buyingPower}</Typography>
      <Typography variant="body2" sx={{ marginTop: 1 }}>Total: ${buyingPower}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button variant="outlined" onClick={onEnableMargin}>Enable margin</Button>
        <Button variant="contained" onClick={onDeposit}>Deposit funds</Button>
      </Box>
    </Paper>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [investmentItems, setInvestmentItems] = useState([]);
  const [buyingPower, setBuyingPower] = useState(0.02);
  const [timeRange, setTimeRange] = useState('1D');

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

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Optionally, update the chart data based on the selected time range
  };

  const handleDepositFunds = () => {
    console.log("Depositing funds...");
  };

  const handleEnableMargin = () => {
    console.log("Enabling margin...");
  };

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

        setInvestmentItems(formattedItems);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    }

    fetchPortfolioData();
  }, []);

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
                    <ButtonGroup fullWidth sx={{ marginBottom: 2 }}>
                      <Button onClick={() => handleTimeRangeChange('LIVE')}>LIVE</Button>
                      <Button onClick={() => handleTimeRangeChange('1D')}>1D</Button>
                      <Button onClick={() => handleTimeRangeChange('1W')}>1W</Button>
                      <Button onClick={() => handleTimeRangeChange('1M')}>1M</Button>
                      <Button onClick={() => handleTimeRangeChange('3M')}>3M</Button>
                      <Button onClick={() => handleTimeRangeChange('YTD')}>YTD</Button>
                      <Button onClick={() => handleTimeRangeChange('1Y')}>1Y</Button>
                      <Button onClick={() => handleTimeRangeChange('ALL')}>ALL</Button>
                    </ButtonGroup>
                    <InvestmentChart data={chartData} />
                    <InvestmentOptions
                      buyingPower={buyingPower}
                      onDeposit={handleDepositFunds}
                      onEnableMargin={handleEnableMargin}
                    />
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
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
