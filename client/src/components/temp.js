import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import BalanceDisplay from './components/BalanceDisplay';
import InvestmentChart from './components/InvestmentChart';
import PortfolioSummary from './components/PortfolioSummary';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Example data that you would fetch from an API or similar
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
    // more data...
  ];

  const investmentItems = [
    { name: 'ETH', shares: 0.001624, price: 2735.43 },
    { name: 'BTC', shares: 0.00105957, price: 63702.90 },
    // more items...
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create a theme based on the darkMode state
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
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh',
          padding: 2,
        }}
      >
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <BalanceDisplay total={balanceData.total} todayChange={balanceData.todayChange} />
        <InvestmentChart data={chartData} />
        <PortfolioSummary items={investmentItems} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
