import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Portfolio = () => {
  const [pieData, setPieData] = useState([
    { name: "Equities (Stocks)", value: 170.08, percentage: "70.52%", color: "#00C49F" },
    { name: "Fixed Income (Bonds)", value: 71.08, percentage: "29.47%", color: "#FFBB28" },
    { name: "Cash and Cash Equivalents", value: 0.02, percentage: "0.01%", color: "#FF8042" },
    { name: "Cryptocurrencies", value: 0.02, percentage: "0.01%", color: "#FF8042" }
  ]);

  const [stocksData, setStocksData] = useState([]);

  useEffect(() => {
    // Fetch portfolio data from the backend
    async function fetchPortfolioData() {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard/portfolio');
        const data = await response.json();

        // For each item, fetch the company description by ticker
        const updatedData = await Promise.all(data.map(async (item) => {
          const companyResponse = await fetch(`http://localhost:3000/fin/companydesp/${item.ticker}`);
          const companyData = await companyResponse.json();
          const priceResponse = await fetch(`http://localhost:3000/fin/latestprice/${item.ticker}`);
          const stockPrice = await priceResponse.json();

          return {
            assetName: companyData.name || "N/A",  // Use the fetched company name
            ticker: item.ticker,
            quantityHeld: item.quantity,
            currentPrice: "$" + (stockPrice.c || "N/A"),
            marketValue: "$" + (item.quantity * stockPrice.c.toFixed(2) || "N/A"),
            avgCost: "$" + (item.purchase_price || "N/A"),
            return: (item.quantity * stockPrice.c - item.net_worth) / (item.net_worth) * 100
          };
        }));

        setStocksData(updatedData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    }

    fetchPortfolioData();
  }, []);

  const totalValue = pieData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Box sx={{ p: 10, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom component="div">
        Total Market Value: ${totalValue.toFixed(2)}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <TableContainer component={Paper} sx={{ maxWidth: '60%', mr: 2 }}>
          <Table sx={{ minWidth: 300 }} aria-label="portfolio summary table">
            <TableHead>
              <TableRow>
                <TableCell>Asset Type</TableCell>
                <TableCell align="right">Market Value ($)</TableCell>
                <TableCell align="right">Portfolio Allocation Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pieData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{`$${item.value.toFixed(2)}`}</TableCell>
                  <TableCell align="right">{item.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <PieChart width={300} height={300}>
          <Pie dataKey="value" data={pieData} cx={150} cy={100} outerRadius={100} fill="#8884d8">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={50} />
        </PieChart>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
        <Table sx={{ minWidth: 650 }} aria-label="detailed portfolio table">
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell align="right">Ticker Symbol</TableCell>
              <TableCell align="right">Quantity Held</TableCell>
              <TableCell align="right">Current Market Price</TableCell>
              <TableCell align="right">Market Value</TableCell>
              <TableCell align="right">Average Purchase Cost</TableCell>
              <TableCell align="right">Unrealized Gain/Loss</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocksData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.assetName}</TableCell>
                <TableCell align="right">{row.ticker}</TableCell>
                <TableCell align="right">{row.quantityHeld}</TableCell>
                <TableCell align="right">{row.currentPrice}</TableCell>
                <TableCell align="right">{row.marketValue}</TableCell>
                <TableCell align="right">{row.avgCost}</TableCell>
                <TableCell align="right">
                  {row.return >= 0
                    ? `↑ ${row.return.toFixed(2)}%`
                    : `↓ ${row.return.toFixed(2)}%`}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Portfolio;