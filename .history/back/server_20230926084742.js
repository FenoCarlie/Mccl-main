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
    const sql = "SELECT * FROM container WHERE in_progress = TRUE OR add_date = (SELECT MAX(add_date) FROM container);";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error retrieving data: " + err.message);
            return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
        }
        return res.json(data);
    });
});

app.get("/transport", (req, res) => {
  const sql = "SELECT * FROM transport;";
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
      line,
      shipment,
      booking,
      type,
      id_transport,
      id_tp,
      category,
      status,
      num_truck,
      num_wagon,
      num_platform,
      tare,
      gross_weight,
      client,
      date_in
    } = req.body;

    const sql = `
    INSERT INTO container (
      num_container,
      line,
      shipment,
      booking,
      type,
      id_transport,
      id_tp,
      category,
      status,
      num_truck,
      num_wagon,
      num_platform,
      tare,
      gross_weight,
      client,
      date_in
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
      num_container,
      line,
      shipment,
      booking,
      type,
      id_transport,
      id_tp,
      category,
      status,
      num_truck,
      num_wagon,
      num_platform,
      tare,
      gross_weight,
      client,
      date_in
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

app.delete('/delete/:id_container', (req, res) => {
    const containerId = req.params.id_container;
    // Assuming you are using a database, you can use a query to delete the container with the specified ID
    db.query('DELETE FROM container WHERE id_container = ?', [containerId], (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500); // Send an error status code back to the client
      } else {
        res.sendStatus(200); // Send a success status code back to the client
      }
    });
  });

  app.get('/container/:id_container', (req, res) => {
    const containerId = req.params.id_container;
    db.query('SELECT * FROM container WHERE id_container = ?', [containerId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while attempting to fetch the container'});
      } else {
        res.status(200).json(results);
      }
    });
  });
  app.get('/container/historic/:num_container', (req, res) => {
    const containerNum = req.params.num_container;
    db.query('SELECT * FROM container WHERE num_container = ?', [containerNum], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while attempting to fetch the container'});
      } else {
        res.status(200).json(results);
      }
    });
  });

  /* *********************** */

  app.get("/tp", (req, res) => {
    const sql = "SELECT * FROM tp";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error retrieving data: " + err.message);
        return res.status(500).json({ error: "Error retrieving data" });
      }
      return res.json(data);
    });
  });

  app.get("/clients/suggestions", (req, res) => {
    const searchTerm = req.query.searchTerm; // Le terme de recherche saisi par l'utilisateur
    const sql = "SELECT id_cli, name FROM client WHERE name LIKE ?";
    const searchTermWithWildcard = `%${searchTerm}%`;
  
    db.query(sql, [searchTermWithWildcard], (err, data) => {
      if (err) {
        console.error("Error retrieving client suggestions: " + err.message);
        return res.status(500).json({ error: "Error retrieving client suggestions" });
      }
      return res.json(data);
    });
  });

  /* *********************** */
  
  app.put('/container/:id_container', (req, res) => {
  const containerId = req.params.id_container;
  const updatedContainer = req.body;

  db.query('UPDATE container SET ? WHERE id_container = ?', [updatedContainer, containerId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while attempting to update the container' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Container not found' });
    } else {
      res.status(200).json({ message: 'Container updated successfully' });
    }
  });
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
