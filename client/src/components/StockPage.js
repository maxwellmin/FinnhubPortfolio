import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockPage = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);


  // const fetchStockData = async () => {
  //   const response = await fetch(`https://api.example.com/stock/${symbol}/history`);
  //   const data = await response.json();
  
  //   const formattedData = data.map(item => ({
  //     date: item.date,
  //     close: item.close
  //   }));
  
  //   setStockData(formattedData);
  // };
  

  useEffect(() => {
    // Replace this with your actual API call
    const fetchStockData = async () => {
      // Mocked data for demonstration purposes
      const mockData = [
        { date: '2023-08-01', close: 145.32 },
        { date: '2023-08-02', close: 146.67 },
        { date: '2023-08-03', close: 144.15 },
        { date: '2023-08-04', close: 148.89 },
        { date: '2023-08-05', close: 150.23 },
        // Add more data points as needed
      ];

      // Simulate API call delay
      setTimeout(() => setStockData(mockData), 500);
    };

    fetchStockData();
  }, [symbol]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Stock Information for {symbol}</Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        Displaying stock details, charts, news, and more for {symbol}.
      </Typography>

      {stockData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body2">Loading stock data...</Typography>
      )}
    </Box>
  );
};

export default StockPage;
