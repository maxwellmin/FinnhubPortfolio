import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import apiRoutes from './routes/api.js';  // Import the routes

import * as finAPI from './finAPI.js';
import yahooFinance from 'yahoo-finance2';
import finnhub from 'finnhub';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create the MySQL pool connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'abcdA2913236',
  database: 'dashboard'
});

// Use the API routes and pass the pool to them
app.use('/api', apiRoutes(pool));  // This will add the /api prefix to your routes

//search框内自动填充股票ticker
app.get('/fin/searchutil/:keyword', async (req, res) => {
  console.log(`\nSearch-utilities Call: ${req.params.keyword}`);
  let origRes = await finAPI.getAutocomplete(req.params.keyword);
  let msg = `${req.params.keyword} Search-utilities finished at ${Date()}\nLength of response: ${origRes['result'].length}`;
  console.log(msg);

  let origResult = origRes['result'];
  console.log('origResult:', origResult)
  const fillteredRes = origResult.filter(item =>
      !item.symbol.includes('.') &&
      item.type === "Common Stock"
  );
  console.log(`Length of filtered result: ${fillteredRes.length}`);
  return res.send(fillteredRes);
});

//搜索公司描述（公司网址，ipo，logo ...）
app.get('/fin/companydesp/:tickerName', async (req, res) => {
  console.log(`\nCompany Description Data Call: ${req.params.tickerName.toUpperCase()}`);
  let origRes = await finAPI.getCompanyDescription(req.params.tickerName);
  console.log(`${req.params.tickerName.toUpperCase()} Company Description Data finished at ${Date()}\n`);
  return res.send(origRes);
});

//获取股票最新价格
app.get('/fin/latestprice/:tickerName', async (req, res) => {
  console.log(`\nLatest Price Call: ${req.params.tickerName.toUpperCase()}`);
  let origRes = await finAPI.getLatestPrice(req.params.tickerName);
  console.log(`${req.params.tickerName.toUpperCase()} Latest Price finished at ${Date()}\n`);
  return res.send(origRes);
});

//获取历史数据 yahoo
app.get('/fin/yahoo1/historical/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const range = req.query.range || "1y";
  const interval = req.query.interval || "1d";
  
  const uri = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`;

  try {
      const response = await axios.get(uri);
      const data = response.data;

      if (data.chart.result) {
          const result = data.chart.result[0];
          const timestamps = result.timestamp.map(t => new Date(t * 1000));
          const prices = result.indicators.quote[0].close; // You can also use 'high', 'low', or 'open' based on your need
          const opens = result.indicators.quote[0].open;
          const highs = result.indicators.quote[0].high;
          const lows = result.indicators.quote[0].low;
          const volumes = result.indicators.quote[0].volume;

          const resultArray = timestamps.map((timestamp, index) => ({
              date: timestamp.toISOString().slice(0, 10),
              close: parseFloat(prices[index].toFixed(2)),  // Convert back to a number
              open: parseFloat(opens[index].toFixed(2)),
              high: parseFloat(highs[index].toFixed(2)),
              low: parseFloat(lows[index].toFixed(2)),
              volume: volumes[index]
          }));

          res.json(resultArray);
      } else {
          res.status(404).json({ error: "No data found for the given ticker" });
      }
  } catch (error) {
      console.error('Error fetching historical data:', error);
      res.status(500).send('Error fetching historical data');
  }
});

// 获取新闻数据
app.get('/fin/news/:keyword', async (req, res) => {
  console.log(`\nNews Call: ${req.params.keyword.toUpperCase()}`);
  let a = await finAPI.getNews(req.params.keyword);
  let count = 0;
  let array = [];

  for (let i = 0; i < a.length; i++) {
      if (a[i]["category"] && a[i]["datetime"] && a[i]["headline"] && a[i]["id"] && a[i]["image"] && a[i]["related"] && a[i]["source"] && a[i]["summary"] && a[i]["url"] && count < 5) {
          count += 1;
          array.push(a[i]);
      }
  }
  return res.send(array);
});

//获取当前数据 yahoo
app.get('/fin/yahoo1/current/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const range = req.query.range || "1d";
  const interval = req.query.interval || "1d";
  
  const encodedTicker = encodeURIComponent(ticker);
  const uri = `https://query1.finance.yahoo.com/v8/finance/chart/${encodedTicker}?interval=${interval}&range=${range}`;

  console.log('Fetching URI:', uri);

  try {
      const response = await axios.get(uri);
      const data = parseFloat(response.data.chart.result[0].indicators.quote[0].close[0].toFixed(2));
      res.json(data);
  } catch (error) {
      console.error('Error fetching current data:', error);
      res.status(500).send('Error fetching current data');
  }
});



//根据ticker和时间range获取close price
app.get('/fin/yahoo1/historical/timeRange/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const range = req.query.range || "1y"; // Optional, can still be used if no specific start and end are provided
  const interval = req.query.interval || "1d";
  
  // Use start and end time if provided, otherwise use range
  const start = req.query.start ? new Date(req.query.start).getTime() / 1000 : null; 
  const end = req.query.end ? new Date(req.query.end).getTime() / 1000 : null;

  let uri;

  if (start && end) {
    uri = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${interval}&period1=${start}&period2=${end}`;
  } else {
    uri = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${interval}&range=${range}`;
  }

  try {
    const response = await axios.get(uri);
    const data = response.data;
    //console.log(data.chart.result[0].indicators.quote[0]);

    if (data.chart.result) {
      const result = data.chart.result[0];
      const timestamps = result.timestamp.map(t => new Date(t * 1000));
      const prices = result.indicators.quote[0].close; // You can also use 'high', 'low', or 'open' based on your need

      const resultArray = timestamps.map((timestamp, index) => ({
        date: timestamp.toISOString().slice(0, 10),
        close: prices[index] !== null ? prices[index].toFixed(2) : null,
      }));

      res.json(resultArray);
    } else {
      res.status(404).json({ error: "No data found for the given ticker" });
    }
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).send('Error fetching historical data');
  }
});

// Function to check if the response is an object and log its length
function checkObject(priceRes, tickerName) {
  if (typeof priceRes === "object") {
      console.log(`${tickerName} Record length: ${Object.keys(priceRes).length}`);
  } else {
      console.log(`${tickerName} Ticker Not Found`);
  }
}


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});