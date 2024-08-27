import express from "express"
import mysql from "mysql2/promise"

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static('public'))

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'abcdA2913236',
    database: 'dashboard'
})

// Get portfolio composition
app.get('/dashboard/portfolio', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM portfolio');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve portfolio' });
    }
  })

  // Handle buy/sell transactions
  app.post('/dashboard/transaction', async (req, res) => {
    const { ticker, transaction_type, transaction_quantity, transaction_price } = req.body;
  
    try {
      // Step 1: Find the asset_id using the ticker
      const [portfolioRows] = await pool.query('SELECT asset_id, quantity FROM portfolio WHERE ticker = ?', [ticker]);
  
      if (portfolioRows.length === 0) {
        if (transaction_type === 'BUY') {
          // If it's a buy transaction and the ticker doesn't exist, insert it into the portfolio
          const [result] = await pool.query(
            'INSERT INTO portfolio (ticker, asset_type, quantity, purchase_price) VALUES (?, ?, ?, ?)',
            [ticker, 'Stock', transaction_quantity, transaction_price]
          );
          const asset_id = result.insertId; // Get the newly inserted asset_id
  
          // Step 2: Insert the transaction with the new asset_id
          await pool.query(
            'INSERT INTO transaction (asset_id, ticker, transaction_type, transaction_quantity, transaction_price) VALUES (?, ?, ?, ?, ?)',
            [asset_id, ticker, transaction_type, transaction_quantity, transaction_price]
          );
        } else {
          // If it's a sell transaction but the asset doesn't exist in the portfolio
          return res.status(400).json({ message: 'Cannot sell an asset that does not exist in the portfolio' });
        }
      } else {
        const asset_id = portfolioRows[0].asset_id;
        const currentQuantity = portfolioRows[0].quantity;
  
        // Step 3: Insert the transaction
        await pool.query(
          'INSERT INTO transaction (asset_id, ticker, transaction_type, transaction_quantity, transaction_price) VALUES (?, ?, ?, ?, ?)',
          [asset_id, ticker, transaction_type, transaction_quantity, transaction_price]
        );
  
        // Step 4: Update the portfolio based on the transaction type
        if (transaction_type === 'BUY') {
          await pool.query(
            'UPDATE portfolio SET quantity = quantity + ? WHERE asset_id = ?',
            [transaction_quantity, asset_id]
          );
        } else if (transaction_type === 'SELL') {
          if (currentQuantity < transaction_quantity) {
            return res.status(400).json({ message: 'Not enough quantity to sell' });
          }
          await pool.query(
            'UPDATE portfolio SET quantity = quantity - ? WHERE asset_id = ?',
            [transaction_quantity, asset_id]
          );
        }
      }
  
      res.status(201).json({ message: 'Transaction successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to process transaction' });
    }
  })
  
  
app.listen(port, () => {
    console.log(`Server running on http://localhost:${3000}`);
  })