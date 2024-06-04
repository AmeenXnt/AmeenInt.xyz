const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, registration_time TEXT)");
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const registrationTime = new Date().toISOString();
    const stmt = db.prepare("INSERT INTO users (username, password, registration_time) VALUES (?, ?, ?)");
    stmt.run(username, password, registrationTime, (err) => {
        if (err) {
            res.json({ success: false, message: 'Error registering user.' });
        } else {
            res.json({ success: true, message: 'User registered successfully.' });
        }
    });
    stmt.finalize();
});

// Endpoint to fetch database contents
app.get('/database', (req, res) => {
    db.all("SELECT username, registration_time FROM users", [], (err, rows) => {
        if (err) {
            res.json([]);
        } else {
            res.json(rows);
        }
    });
});

// Serve other HTML pages
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/database.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'database.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
