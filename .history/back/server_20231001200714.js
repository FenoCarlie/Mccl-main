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

app.get("/user", (req, res) => {
  const sql = "select * from user;";
  db.query(sql, (err, data) => {
      if (err) {
          console.error("Error retrieving data: " + err.message);
          return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
      }
      return res.json(data);
  });
});

app.get("/", (req, res) => {
    const sql = "select * from container WHERE date_out = '0000-00-00';";
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

app.get("/container/in_progress", (req, res) => {
  const sql = "SELECT c.*, tp.location, transport.company FROM container c LEFT JOIN tp ON c.id_tp = tp.id_tp LEFT JOIN transport ON c.id_transport = transport.id_transport WHERE progress = true;";
  db.query(sql, (err, data) => {
      if (err) {
          console.error("Error retrieving data: " + err.message);
          return res.status(500).json({ error: "Error retrieving data" }); // Return an error response
      }
      return res.json(data);
  });
});
app.get("/container/in_progress-last", (req, res) => {
  const sql = "SELECT c.* FROM container c WHERE (c.progress = TRUE) OR (c.progress = FALSE AND c.add_date = ( SELECT MAX(c2.add_date) FROM container c2 WHERE c2.num_container = c.num_container ));";
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
app.post('/create/user', (req, res) => {
    const {
      password,
      reg_number,
      name,
      position
    } = req.body;

    const sql = `
    INSERT INTO container (
      password,
      reg_number,
      name,
      position
    ) VALUES (?, ?, ?)
`;

    const values = [
      password,
      reg_number,
      name,
      position
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

    const query = `
      SELECT 
        c.*,
        tp.location,
        transport.company
      FROM 
        container c
      LEFT JOIN 
        tp ON c.id_tp = tp.id_tp
      LEFT JOIN 
        transport ON c.id_transport = transport.id_transport
      WHERE 
        c.id_container = ?
    `;

    db.query(query, [containerId], (error, results) => {
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
    
    const query = `
      SELECT c.*, tp.location, transport.company FROM container c LEFT JOIN tp ON c.id_tp = tp.id_tp LEFT JOIN transport ON c.id_transport = transport.id_transport WHERE c.num_container = ?
    `;
  
    db.query(query, [containerNum], (error, results) => {
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
    const searchTerm = req.query.searchTerm;
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
app.put('/container/get_out/:id_container', (req, res) => {
  const containerId = req.params.id_container;
  const updatedDateOut = req.body.date_out; // Obtenir la nouvelle date_out depuis le corps de la requête

  db.query('UPDATE container SET date_out = ? WHERE id_container = ?', [updatedDateOut, containerId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while attempting to update the date_out' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Container not found' });
    } else {
      res.status(200).json({ message: 'Date_out updated successfully' });
    }
  });
});

app.get('/data', (req, res) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;

  const query = `
    SELECT 
      date_in, 
      date_out, 
      category
    FROM 
      container
    WHERE 
      (date_in BETWEEN ? AND ?) OR
      (date_out BETWEEN ? AND ?)
  `;

  db.query(query, [startDate, endDate, startDate, endDate], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while attempting to fetch the data'});
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/api/import-export', (req, res) => {
  const query = 'SELECT category, date_in as date FROM container ORDER BY date ASC;';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    } else {
      res.json(results);
    }
  });
});
app.get('/api/progress_false', (req, res) => {
  const query = 'SELECT * FROM container WHERE progress = FALSE;';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    } else {
      res.json(results);
    }
  });
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
