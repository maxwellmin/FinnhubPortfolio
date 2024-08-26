import React from 'react';

const PortfolioSummary = ({ items }) => (
  <ul className="PortfolioSummary">
    {items.map((item, index) => (
      <li key={index}>
        {item.name} - {item.shares} Shares - ${item.price}
      </li>
    ))}
  </ul>
);

export default PortfolioSummary;
