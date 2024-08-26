import React from 'react';
import '../App.css';

const BalanceDisplay = ({ total, todayChange }) => {
  // Determine the CSS class based on the value of todayChange
  const changeClass = todayChange > 0 ? 'positive' : todayChange < 0 ? 'negative' : 'neutral';

  return (
    <div className="BalanceDisplay">
      <h2>Current Balance: ${total}</h2>
      <p className={changeClass}>{todayChange} Today</p>
    </div>
  );
};

export default BalanceDisplay;



// import React from 'react';

// const BalanceDisplay = ({ total, todayChange }) => (
//   <div className="BalanceDisplay" style={{ paddingTop: '50px', paddingLeft: '100px' }}> {/* Adjust padding as needed */}
//     <h2>Current Balance: ${total} </h2>
//     <p>{todayChange} Today</p>
//   </div>
// );

// export default BalanceDisplay;