const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());

// Create a connection to the database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mccl_db"
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Database connection error: " + err.message);
        return res.status(500).json({ error: "Database connection error" }); // Return an error response
    } else {
        console.log("Connected to the database");
    }
});

app.get("/", (req, res) => {
    const sql = "SELECT * FROM container";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error retrieving data: " + err.message);
            return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
        }
        return res.json(data);
    });
});

app.post('/create', (req, res) => {
    const {
      num_container,
      type,
      category,
      status,
      live,
      date_in,
      date_out,
      id_cli,
      tp_name,
      code_location_tp,
      position,
      name_container
    } = req.body;

    const sql = `
        INSERT INTO container (
            num_container,
            type,
            category,
            status,
            live,
            date_in,
            date_out,
            id_cli,
            tp_name,
            code_location_tp,
            position,
            name_container
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        num_container,
        type,
        category,
        status,
        live,
        date_in,
        date_out,
        id_cli,
        tp_name,
        code_location_tp,
        position,
        name_container
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting data: " + err.message);
            return res.status(500).json({ error: "Error inserting data" }); // Return an error response
        }

        console.log("Data inserted successfully");
        return res.status(200).json({ message: "Data inserted successfully", data: result });
    });
});

app.delete('/delete_container/:id', (req, res) => {
    const containerId = req.params.id;
  
    // Assuming you are using a database, you can use a query to delete the container with the specified ID
    db.query('DELETE FROM containers WHERE id = ?', [containerId], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500); // Send an error status code back to the client
      } else {
        res.sendStatus(200); // Send a success status code back to the client
      }
    });
  });

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
