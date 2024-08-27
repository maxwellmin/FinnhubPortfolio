import express from 'express';
import bodyParser from 'body-parser'
import mysql from 'mysql2/promise'
//set up and configure express
const app = express();
app.use(bodyParser.json());

//set up and intialize the database connection
const connection = mysql.createPool({
host: "localhost",
user: "root",
password: "c0nygre",
database: "dashboard"
});

app.listen(8081, () => {
    console.log("the server is running")
})


    // get all 
    app.get("/portfolio", async (req, res) =>
        {
            try{
                const param = req.params
                const [rows] = await connection.query("SELECT * FROM portfolio", [param])
                res.json(rows)
                
            }catch(error){
                res.status(500).send(error.message)
            }
        })

    //get by ticker wrong
app.get("/portfolio/:ticker", async (req, res) =>
{
    try{
        const param = req.params.ticker
        const [rows] = await connection.query("SELECT * FROM portfolio WHERE ticker = ?", [param])
        if(rows.length > 0){
            res.json(rows[0])
        } else{
            res.status(404).send("not found :>")
        }
        
    }catch(error){
        res.status(500).send(error.message)
    }
})

    //when user execute "sell"
app.delete("/sell", async (req, res) =>
    {
        try{
            const {asset_type, ticker, quantity, purchase_price, net_worth} = req.body
            //check whether the quantity is rational
            
            const [rows] = await connection.query("SELECT * FROM portfolio WHERE ticker = ?", ticker)
            console.log(rows)
            const existingStock = rows[0];
            const allQuantity = existingStock.quantity
            const id = existingStock.asset_id
            if(quantity < allQuantity){

                //if exit, update price and quantity of table portfolio
                
                const newQuantity = +allQuantity - +quantity
                // console.log(quantity)
                // console.log(newQuantity)
                const newTotalValue = existingStock.net_worth - (purchase_price * quantity);
                // console.log(newTotalValue)
                const newPrice = newTotalValue / newQuantity;

                await connection.query("update portfolio"
                    + " set quantity = ?, purchase_price = ?"
                    + " where ticker = ?", [newQuantity, newPrice, ticker])
    
                // res.json({id, asset_type, ticker, quantity, purchase_price, net_worth, last_updated})
                
            } else if(quantity == allQuantity){
                await connection.query("update portfolio"
                    + " set quantity = ?, purchase_price = ?"
                    + " where ticker = ?", [0, existingStock.net_worth - (purchase_price * quantity), ticker])

            } else{
                res.status(400).send("Not enough quantity to sell")
            }

            // also add this operation into table transaction
            const [results2] = await connection.query("insert into transaction"
                + "(asset_id, transaction_type, transaction_quantity, transaction_price)"
                + "values(?,?,?,?)", [id, "SELL", quantity, purchase_price])
            res.status(201).send("Transaction successful")

            
        }catch(error){
            res.status(500).send(error.message)
        }
    })
    

    //when user execute "buy"
app.post("/buy", async (req, res) =>
    {
        try{
            const {id,asset_type, ticker, quantity, purchase_price, net_worth, last_updated} = req.body
            // whether the ticker already exit
            const [rows] = await connection.query("SELECT * FROM portfolio WHERE ticker = ?", ticker)
            console.log(rows)
            if(rows.length > 0){
                //if exit, update price and quantity of table portfolio
                const existingStock = rows[0];
                const newQuantity = +existingStock.quantity + +quantity
                // console.log(quantity)
                // console.log(newQuantity)
                const newTotalValue = (existingStock.purchase_price * existingStock.quantity) + (purchase_price * quantity);
                // console.log(newTotalValue)
                const newPrice = newTotalValue / newQuantity;
                // console.log(newPrice)

                await connection.query("update portfolio"
                    + " set quantity = ?, purchase_price = ?"
                    + " where ticker = ?", [newQuantity, newPrice, ticker])
    
                // res.json({id, asset_type, ticker, quantity, purchase_price, net_worth, last_updated})
                
                // also add this operation into table transaction
                await connection.query("insert into transaction"
                    + "(asset_id, transaction_type, transaction_quantity, transaction_price)"
                    + "values(?,?,?,?)", [existingStock.asset_id, "BUY", quantity, purchase_price])
                res.status(201).send("update successful")

                
            } else{
                const [results] = await connection.query("insert into portfolio"
                    + "(asset_type, ticker, quantity, purchase_price)"
                    + " values(?,?,?,?)", [asset_type, ticker, quantity, purchase_price])

                // also add this operation into table transaction
                const [results2] = await connection.query("insert into transaction"
                    + "(asset_id, transaction_type, transaction_quantity, transaction_price)"
                    + "values(?,?,?,?)", [results.insertId, "BUY", quantity, purchase_price])
                res.status(201).send("update successful")
            }

            
        }catch(error){
            res.status(500).send(error.message)
        }
    })


    


app.get("/transaction", async (req, res) =>
    {
        try{
            const param = req.params
            const [rows] = await connection.query("SELECT * FROM transaction", [param])
            res.json(rows)
            
        }catch(error){
            res.status(500).send(error.message)
        }
    })

app.get("/transaction/:transaction_id", async (req, res) =>
    {
        try{
            const param = req.params.transaction_id
            const [rows] = await connection.query("SELECT * FROM transaction WHERE transaction_id = ?", [param])
            if(rows.length > 0){
                res.json(rows[0])
            } else{
                res.status(404).send("not found :>")
            }
                
        }catch(error){
            res.status(500).send(error.message)
        }
    })


 
