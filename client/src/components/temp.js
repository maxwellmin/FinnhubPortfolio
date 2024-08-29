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
import Careers from './components/Careers';  // Make sure this is named correctly and matches the export name
import ContactUs from './components/ContactUs'; // Ensure file and component names are consistent
import Funds from './components/Funds';

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
    // Define your chart data here...
  ];

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    // Fetch data implementation...
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
            } />
            <Route path="/stock/:symbol" element={<StockPage onTransactionComplete={handleTransactionComplete} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<Login />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/funds" element={<Funds />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
