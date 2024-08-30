import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Portfolio = () => {
  const [pieData, setPieData] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/dashboard/portfolio');
        const data = await response.json();
        console.log('Portfolio Data:', data);

        if (!Array.isArray(data)) {
          throw new Error('Expected an array of data');
        }

        // Fetch the company descriptions and latest prices
        const updatedData = await Promise.all(data.map(async (item) => {
          const companyResponse = await fetch(`http://localhost:3000/fin/companydesp/${item.ticker}`);
          const companyData = await companyResponse.json();
          let priceResponse
          if (item.asset_type === 'Cryptocurrencies') {
            priceResponse = await fetch(`http://localhost:3000/fin/yahoo1/current/${item.ticker}`);
          } else {
            priceResponse = await fetch(`http://localhost:3000/fin/yahoo1/current/${item.ticker}`);
          }

          const stockPrice = await priceResponse.json();

          const currentPrice = parseFloat(stockPrice) || 0;
          const quantityHeld = parseFloat(item.quantity) || 0;
          const marketValue = currentPrice * quantityHeld;
          const netWorth = parseFloat(item.net_worth) || 0;
          const changeInValue = marketValue - netWorth;

          return {
            assetName: (() => {
              if (item.ticker === "QQQ") return "Invesco QQQ Trust";
              if (item.ticker === "BTC-USD") return "Bitcoin";
              return companyData.name || "N/A";
            })(),
            ticker: item.ticker,
            quantityHeld: quantityHeld.toFixed(2),
            currentPrice: "$" + (currentPrice.toFixed(2) || "N/A"),
            marketValue: "$" + (marketValue.toFixed(2) || "N/A"),
            avgCost: "$" + (parseFloat(item.purchase_price) || "N/A"),
            return: netWorth ? ((marketValue - netWorth) / netWorth * 100).toFixed(2) : "N/A",
            assetType: item.asset_type, // Include assetType for pieData calculation
            changeInValue: changeInValue.toFixed(2)
          };
        }));

        console.log('Stocks Data:', updatedData);
        setStocksData(updatedData);

        // Calculate pieData based on updatedData
        const assetTypeTotals = updatedData.reduce((acc, item) => {
          if (!acc[item.assetType]) {
            acc[item.assetType] = { value: 0, color: getColorForAssetType(item.assetType) };
          }
          acc[item.assetType].value += parseFloat(item.marketValue.replace('$', '').replace(',', '')) || 0;
          return acc;
        }, {});

        const totalNetWorth = Object.values(assetTypeTotals).reduce((sum, asset) => sum + asset.value, 0);

        const updatedPieData = Object.entries(assetTypeTotals).map(([key, value]) => ({
          name: key,
          value: value.value,
          percentage: totalNetWorth > 0 ? ((value.value / totalNetWorth) * 100).toFixed(2) + '%' : '0%',
          color: value.color
        }));

        console.log('Pie Data:', updatedPieData);
        setPieData(updatedPieData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioData();
  }, []);

  const getColorForAssetType = (assetType) => {
    switch (assetType) {
      case 'Stocks':
        return "#750009";
      case 'ETFs':
        return "#DB0011";
      case 'Cryptocurrencies':
        return "#FF7580";
      default:
        return "#f8f4f0";
    }
  };

  const totalValue = pieData.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);

  return (
    <Box sx={{ p: 10, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom component="div">
        Total Market Value: ${totalValue.toFixed(2)}
      </Typography>

      {loading ? (
        <Typography variant="h6" component="div">Loading...</Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <TableContainer component={Paper} sx={{ maxWidth: '60%', mr: 2 }}>
            <Table sx={{ minWidth: 300 }} aria-label="portfolio summary table">
              <TableHead>
                <TableRow>
                  <TableCell>Asset Type</TableCell>
                  <TableCell align="right">Market Value</TableCell>
                  <TableCell align="right">Portfolio Allocation Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pieData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">${(parseFloat(item.value) || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{item.percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PieChart width={450} height={300}>
            <Pie dataKey="value" data={pieData} cx={200} cy={140} outerRadius={105}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={30} />
          </PieChart>
        </Box>
      )}

      <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
        <Typography variant="h5" gutterBottom>
          Detailed Portfolio Profile
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="detailed portfolio table">
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell align="left">Ticker Symbol</TableCell>
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
                <TableCell align="left">{row.ticker}</TableCell>
                <TableCell align="right">{row.quantityHeld}</TableCell>
                <TableCell align="right">{row.currentPrice}</TableCell>
                <TableCell align="right">{row.marketValue}</TableCell>
                <TableCell align="right">{row.avgCost}</TableCell>
                <TableCell align="right" style={{ color: row.return && row.return !== "N/A" && parseFloat(row.return) >= 0 ? 'green' : 'red' }}>
                  {row.changeInValue && row.return && row.return !== "N/A"
                    ? `${row.changeInValue >= 0 ? '↑' : '↓'} $${Math.abs(row.changeInValue)} (${row.return}%)`
                    : "N/A"}
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