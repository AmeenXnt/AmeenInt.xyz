const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, registration_time TEXT)");
    db.run("CREATE TABLE quotes (id INTEGER PRIMARY KEY, username TEXT, quote TEXT, author TEXT)");
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

    const stmt = db.prepare("INSERT INTO users (username, password, registration_time) VALUES (?, ?, ?)");
    stmt.run(username, password, registrationTime, (err) => {
        if (err) {
            res.json({ success: false, message: 'Error registering user.' });
        } else {
            // Create a separate HTML page for the user
            const userPagePath = path.join(__dirname, 'public', `user_${username}.html`);
            const userPageContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${username}'s Page</title>
                    <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                    <div class="form-container">
                        <h2>Welcome, ${username}</h2>
                        <form id="quoteForm">
                            <input type="text" id="quote" placeholder="Your Quote" required>
                            <input type="text" id="author" placeholder="Author Name" required>
                            <button type="submit">Send</button>
                        </form>
                    </div>
                    <script src="script.js"></script>
                </body>
                </html>
            `;
            fs.writeFileSync(userPagePath, userPageContent);
            res.json({ success: true, message: 'User registered successfully.', username });
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
            res.json({ success: true, message: 'Login successful.', username });
        } else {
            res.json({ success: false, message: 'You are not registered. Please create an account.' });
        }
    });
});

// Endpoint to handle quote submission
app.post('/submit-quote', (req, res) => {
    const { username, quote, author } = req.body;
    const stmt = db.prepare("INSERT INTO quotes (username, quote, author) VALUES (?, ?, ?)");
    stmt.run(username, quote, author, (err) => {
        if (err) {
            res.json({ success: false, message: 'Error saving quote.' });
        } else {
            res.json({ success: true, message: 'Quote saved successfully.' });
        }
    });
    stmt.finalize();
});

// Endpoint to fetch all quotes
app.get('/saved-quotes', (req, res) => {
    db.all("SELECT username, quote, author FROM quotes", [], (err, rows) => {
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
