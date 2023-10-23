const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());
app.use(cors());

// Use cors() as a middleware function to enable CORS
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
        
    } else {
        console.log("Connected to the database");
    }
});

app.get("/", (req, res) => {
    const sql = "SELECT * FROM container";
    db.query(sql, (err, data) => {
        if (err) {
            return res.json({ error: "Error" });
        }
        return res.json(data);
    });
});

app.post('/create_container', (req, res) => {
    const sql = "INSERT INTO container (`num_container`, `type`, `category`, `status`, `live`, `date_in`, `date_out`, `name_container`, `id_cli`, `tp_name`, `code_location_tp`, `position`) VALUES (????????????)";
    const values = [
        req.body.num_container,
        req.body.type,
        req.body.category,
        req.body.status,
        req.body.live,
        req.body.date_in,
        req.body.date_out,
        req.body.id_cli,
        req.body.tp_name,
        req.body.code_location_tp,
        req.body.position
    ]
    db.query(sql, [value], (err, date) => {
        if(err) return res.json("Error");
        return res.json(data);
    })
} )

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});

