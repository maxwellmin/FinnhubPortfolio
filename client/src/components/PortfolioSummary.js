import React from 'react';
import '../App.css'; 

const PortfolioSummary = ({ items }) => (
  <ul className="PortfolioSummary">
    {items.map((item, index) => (
      <li key={index} className="portfolio-item">
        <div className="item-name">{item.name}</div>
        <div className="item-details">
          {(item.shares)} Shares&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;————&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.price}
        </div>

      </li>
    ))}
  </ul>
);

export default PortfolioSummary;
