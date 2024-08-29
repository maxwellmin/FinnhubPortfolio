import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Grid } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BalanceDisplay from './components/BalanceDisplay';
import InvestmentChart from './components/InvestmentChart';
import PortfolioSummary from './components/PortfolioSummary';
import StockPage from './components/StockPage'; 
import Portfolio from './components/Portfolio'; 
import Login from './components/Login'; 
import History from './components/History';
import Careers from './components/careers';
import Contact from './components/contactUs';
import Developers from './components/Developers';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [investmentItems, setInvestmentItems] = useState([]);
  const [buyingPower, setBuyingPower] = useState(0.02);
  const [timeRange, setTimeRange] = useState('1D');
  const balanceData = {
    total: '246.03',
    todayChange: '+0.09',
  };

  const chartData = [];

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/portfolio');
      if (response.ok) {
        const data = await response.json();
        const formattedItems = data.map(item => ({
          name: item.ticker,
          shares: item.quantity,
          price: item.purchase_price,
        }));
        setInvestmentItems(formattedItems);
      } else {
        throw new Error('Failed to fetch portfolio data');
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };

  const handleTransactionComplete = () => {
    fetchPortfolioData();
  };

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
            <Route path="/stock/:symbol" element={<StockPage onTransactionComplete={handleTransactionComplete} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<Login />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/developers" element={<Developers />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

