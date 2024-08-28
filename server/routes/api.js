import express from "express";

const router = express.Router();

// Pass the pool connection as an argument
export default (pool) => {
  
  // Get portfolio composition
  router.get('/dashboard/portfolio', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM portfolio');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ message: 'Failed to retrieve portfolio' });
    }
  });

    // Get transaction composition
    router.get('/dashboard/transaction', async (req, res) => {
      try {
        const [rows] = await pool.query('SELECT * from transaction');
        res.json(rows);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ message: 'Failed to retrieve transaction' });
      }
    });

  // Buy/Sell Transaction Handler
  
router.post('/dashboard/transaction', async (req, res) => {
  const { ticker, transaction_type, transaction_quantity, transaction_price, asset_type } = req.body;

  try {
    // Step 1: Find the portfolio entry for the given ticker
    const [portfolioRows] = await pool.query('SELECT * FROM portfolio WHERE ticker = ?', [ticker]);

    // Handle Buy Transaction
    if (transaction_type === 'BUY') {
      if (portfolioRows.length === 0) {
        // Case 2.2: Ticker doesn't exist in portfolio, insert a new record
        const [insertResult] = await pool.query(
          'INSERT INTO portfolio (ticker, asset_type, quantity, purchase_price) VALUES (?, ?, ?, ?)',
          [ticker, asset_type, transaction_quantity, transaction_price]
        );
        const asset_id = insertResult.insertId; // Get the newly inserted asset_id

        // Insert the transaction record
        await pool.query(
          'INSERT INTO transaction (ticker, transaction_type, transaction_quantity, transaction_price) VALUES (?, ?, ?, ?)',
          [ticker, transaction_type, transaction_quantity, transaction_price]
        );
        return res.status(201).json({ message: 'Buy transaction successful and new asset added to portfolio' });
      } else {
        // Case 2.1: Ticker exists, update the portfolio record
        const portfolio = portfolioRows[0];
        const asset_id = portfolio.asset_id;
        const currentQuantity = parseFloat(portfolio.quantity);
        const currentPurchasePrice = parseFloat(portfolio.purchase_price);
        const currentNetWorth = currentQuantity * currentPurchasePrice;

        // Calculate the new quantity and new average purchase price
        const newQuantity = currentQuantity + transaction_quantity;
        const newNetWorth = currentNetWorth + (transaction_quantity * transaction_price);
        const newPurchasePrice = newNetWorth / newQuantity;

        // Update the portfolio with new quantity and new purchase price
        await pool.query(
          'UPDATE portfolio SET quantity = ?, purchase_price = ? WHERE asset_id = ?',
          [newQuantity, newPurchasePrice.toFixed(2), asset_id]
        );

        // Insert the transaction record
        await pool.query(
          'INSERT INTO transaction (ticker, transaction_type, transaction_quantity, transaction_price) VALUES (?, ?, ?, ?)',
          [ticker, transaction_type, transaction_quantity, transaction_price]
        );

        return res.status(201).json({ message: 'Buy transaction successful and portfolio updated' });
      }
    }

    // Handle Sell Transaction
    else if (transaction_type === 'SELL') {
      if (portfolioRows.length === 0) {
        // Case 3.2: Ticker doesn't exist in portfolio, return error
        return res.status(400).json({ message: 'Cannot sell an asset that does not exist in the portfolio' });
      } else {
        // Case 3.1: Ticker exists, update the portfolio record
        const portfolio = portfolioRows[0];
        const asset_id = portfolio.asset_id;
        const currentQuantity = parseFloat(portfolio.quantity);
        const currentPurchasePrice = parseFloat(portfolio.purchase_price);

        if (currentQuantity < transaction_quantity) {
          return res.status(400).json({ message: 'Not enough quantity to sell' });
        }

        // Calculate the new quantity and new average purchase price
        const newQuantity = currentQuantity - transaction_quantity;
        const currentNetWorth = currentQuantity * currentPurchasePrice;
        const sellValue = transaction_quantity * transaction_price;
        const newNetWorth = currentNetWorth - sellValue;

        const newPurchasePrice = newQuantity > 0 ? newNetWorth / newQuantity : 0;

        // Update the portfolio or delete if all sold
        if (newQuantity === 0) {
          await pool.query('DELETE FROM portfolio WHERE asset_id = ?', [asset_id]);
        } else {
          await pool.query(
            'UPDATE portfolio SET quantity = ?, purchase_price = ? WHERE asset_id = ?',
            [newQuantity, newPurchasePrice.toFixed(2), asset_id]
          );
        }

        // Insert the transaction record
        await pool.query(
          'INSERT INTO transaction (ticker, transaction_type, transaction_quantity, transaction_price) VALUES (?, ?, ?, ?)',
          [ticker, transaction_type, transaction_quantity, transaction_price]
        );

        return res.status(201).json({ message: 'Sell transaction successful and portfolio updated' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
  } catch (error) {
    console.error('Error processing transaction:', error);
    return res.status(500).json({ message: 'Failed to process transaction' });
  }
});

  return router;
};