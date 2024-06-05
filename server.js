const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, number TEXT, registration_time TEXT)");
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to handle user registration
app.post('/register', (req, res) => {
    const { username, password, number } = req.body;
    const registrationTime = new Date().toISOString();

    // Validate username (no spaces or symbols) and password (at least 8 characters, including numbers and symbols)
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!usernamePattern.test(username)) {
        res.json({ success: false, message: 'Username should not contain spaces or symbols.' });
        return;
    }

    if (!passwordPattern.test(password)) {
        res.json({ success: false, message: 'Password must be at least 8 characters long and include numbers and symbols.' });
        return;
    }

    const stmt = db.prepare("INSERT INTO users (username, password, number, registration_time) VALUES (?, ?, ?, ?)");
    stmt.run(username, password, number, registrationTime, (err) => {
        if (err) {
            res.json({ success: false, message: 'Error Registering User. Please Let Me Know On Whatsapp +916238768108' });
        } else {
            res.json({ success: true, message: 'Registred Successful ㋡.' });
        }
    });
    stmt.finalize();
});

// Endpoint to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            res.json({ success: false, message: 'Error logging in.' });
        } else if (row) {
            res.json({ success: true, message: 'Login Successful.' });
        } else {
            res.json({ success: false, message: 'Incorrect! Please Register First' });
        }
    });
});

// Endpoint to fetch database contents
app.get('/database', (req, res) => {
    db.all("SELECT username, password, number, registration_time FROM users", [], (err, rows) => {
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

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/database.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'database.html'));
});

app.get('/welcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
