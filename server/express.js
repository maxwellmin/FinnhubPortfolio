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
  password: 'mrp19990511ASD',
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

//获取最新价格
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

          const resultArray = timestamps.map((timestamp, index) => ({
              date: timestamp.toISOString().slice(0, 10),
              close: prices[index].toFixed(2),
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
      if (a[i]["category"] && a[i]["datetime"] && a[i]["headline"] && a[i]["id"] && a[i]["image"] && a[i]["related"] && a[i]["source"] && a[i]["summary"] && a[i]["url"] && count < 20) {
          count += 1;
          array.push(a[i]);
      }
  }
  return res.send(array);
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