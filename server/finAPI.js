import fetch from 'node-fetch';
// import async from 'express-async-errors';
// import url from 'url';
// import https from 'https';

const api_key = "cr6jve9r01qnuep5ti80cr6jve9r01qnuep5ti8g";

export {
    getAutocomplete,
    getCompanyDescription,
    getLatestPrice,
    getHistoricalData,
    getNews,
    getRecommendation,
    getSocialSentiment,
    getCompanyPeers,
    getCompanyEarnings,
    getHistoricalData2
};

async function getAutocomplete(keyword) {
    let url = `https://finnhub.io/api/v1/search?q=${keyword}&token=${api_key}`;
    let headers = {'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let searchRes = await APIres.json();
    return searchRes;
}

async function getCompanyDescription(tickerName) {
    let url = `https://finnhub.io/api/v1/stock/profile2?symbol=${tickerName}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let companydesp = await APIres.json();
    return companydesp;
}

async function getLatestPrice(tickerName) {
    let url = `https://finnhub.io/api/v1/quote?symbol=${tickerName}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let latestprice = await APIres.json();
    return latestprice;
}

async function getHistoricalData(tickerName, from_unix, to_unix) {
    let url = `https://finnhub.io/api/v1/stock/candle?symbol=${tickerName}&resolution=D&from=${from_unix}&to=${to_unix}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let histRes = await APIres.json();
    return histRes;
}

async function getHistoricalData2(tickerName) {
    let date = new Date();
    let date1 = date.setFullYear(date.getFullYear() - 2);
    let to_unix = Math.floor(new Date().getTime() / 1000);
    let from_unix = Math.floor(date1 / 1000);
    let url = `https://finnhub.io/api/v1/stock/candle?symbol=${tickerName}&resolution=D&from=${from_unix}&to=${to_unix}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let histRes = await APIres.json();
    return histRes;
}

async function getNews(keyword) {
    let to_date = new Date().toISOString().slice(0, 10);
    let from_date = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10);
    let url = `https://finnhub.io/api/v1/company-news?symbol=${keyword}&from=${from_date}&to=${to_date}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let origRes = await APIres.json();
    return origRes;
}

async function getRecommendation(keyword) {
    let url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${keyword}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let origRes = await APIres.json();
    return origRes;
}

async function getSocialSentiment(keyword) {
    let url = `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${keyword}&from=2022-01-01&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let origRes = await APIres.json();
    return origRes;
}

async function getCompanyPeers(keyword) {
    let url = `https://finnhub.io/api/v1/stock/peers?symbol=${keyword}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let origRes = await APIres.json();
    return origRes;
}

async function getCompanyEarnings(keyword) {
    let url = `https://finnhub.io/api/v1/stock/earnings?symbol=${keyword}&token=${api_key}`;
    let headers = { 'Content-Type': 'application/json' };
    let APIres = await fetch(url, { method: 'GET', headers: headers });
    let origRes = await APIres.json();
    return origRes;
}
