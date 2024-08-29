import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../App.css'; 

const PortfolioSummary = ({ items }) => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleItemClick = (ticker) => {
    navigate(`/stock/${encodeURIComponent(ticker)}`); // Navigate to the stock page with the respective ticker
  };

  return (
    <ul className="PortfolioSummary">
      {items.map((item, index) => (
        <li 
          key={index} 
          className="portfolio-item"
          onClick={() => handleItemClick(item.name)} // Handle the click event
          style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate it's clickable
        >
          <div className="item-name">{item.name}</div>
          <div className="item-details">
            {(item.shares)} Shares&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;————&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.price}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PortfolioSummary;
