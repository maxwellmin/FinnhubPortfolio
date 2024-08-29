import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Grid } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BalanceDisplay from './components/BalanceDisplay';
import InvestmentChart from './components/InvestmentChart';
import PortfolioSummary from './components/PortfolioSummary';
import StockPage from './components/StockPage'; 
import Portfolio from './components/Portfolio'; 
import Login from './components/Login'; 
import History from './components/History';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track authentication state
  const [investmentItems, setInvestmentItems] = useState([]);
  const [buyingPower, setBuyingPower] = useState(0.02);

  const chartData = [
    // Chart data as previously defined
  ];

  const balanceData = {
    total: '246.03',
    todayChange: '+0.09',
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/" element={isLoggedIn ? (
              <ProtectedContent
                balanceData={balanceData}
                investmentItems={investmentItems}
                theme={theme}
                chartData={chartData}
              />
            ) : (
              <Navigate to="/login" />
            )}/>
            <Route path="/stock/:symbol" element={isLoggedIn ? <StockPage /> : <Navigate to="/login" />} />
            <Route path="/portfolio" element={isLoggedIn ? <Portfolio /> : <Navigate to="/login" />} />
            <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/login" />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

function ProtectedContent({ balanceData, investmentItems, theme, chartData }) {
  return (
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
  );
};


