-- Create the database
CREATE DATABASE dashboard;

-- Use the created database
USE dashboard;

-- Create the 'portfolio' table
CREATE TABLE portfolio (
  asset_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  asset_type VARCHAR(45) NOT NULL,
  ticker VARCHAR(45) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  net_worth DECIMAL(10,2) AS (quantity * purchase_price) STORED,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the 'transaction' table
  CREATE TABLE transaction (
  transaction_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  asset_id INT NOT NULL,
  transaction_type VARCHAR(45) NOT NULL,
  transaction_quantity DECIMAL(10,2) NOT NULL,
  transaction_price DECIMAL(10,2) NOT NULL,
  transaction_value DECIMAL(10,2) AS (transaction_quantity * transaction_price) STORED,
  transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES portfolio(asset_id)
);

-- Insert sample data into the 'portfolio' table
INSERT INTO portfolio (asset_type, ticker, quantity, purchase_price)
VALUES ('Stock', 'APPL', '3', '150.00');