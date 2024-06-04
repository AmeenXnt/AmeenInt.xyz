const fs = require('fs');

// Endpoint to create a new HTML page for each registered user
app.post('/createPage', (req, res) => {
    const { username } = req.body;
    const fileName = username + '.html';
    const filePath = path.join(__dirname, 'public', 'user_pages', fileName);
    const pageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${username}'s Page</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="form-container">
        <h2>Welcome ${username}</h2>
        <h3>Your Quotes:</h3>
        <div id="${username}-quotes"></div>
        <input type="text" id="${username}-quoteInput" placeholder="Enter Quote">
        <input type="text" id="${username}-authorInput" placeholder="Enter Author">
        <button onclick="saveQuote('${username}')">Send</button>
    </div>

    <script src="/script.js"></script>
</body>
</html>`;
    fs.writeFile(filePath, pageContent, (err) => {
        if (err) {
            console.error(err);
            res.json({ success: false, message: 'Error creating user page.' });
        } else {
            res.json({ success: true, message: 'User page created successfully.' });
        }
    });
});
