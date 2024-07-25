function showHelp() {
    alert("Hey I Am AmeenInt This Site Is Maintaining Mode. Its Not Completed Wait Few Days.");
}

function navigateToRegister() {
    window.location.href = "register.html";
}

function navigateToLogin() {
    window.location.href = "login.html";
}

function promptForKey() {
        window.location.href = "database.html";
}

document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var number = document.getElementById('number').value;

    // Validate username (no spaces or symbols) and password (at least 8 characters, including numbers and symbols)
    var usernamePattern = /^[a-zA-Z0-9]+$/;
    var passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!usernamePattern.test(username)) {
        alert("Username should not contain spaces or symbols.");
        return;
    }

    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long and include numbers and symbols.");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, number }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            window.location.href = "index.html";
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('loginUsername').value;
    var password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "https://api-ameen.vercel.app"; // Change to the actual protected page
        } else {
            alert(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function checkKey() {
    var key = document.getElementById('keyInput').value;
    if (key === "MEERAMEEN$") {
        fetch('/database')
            .then(response => response.json())
            .then(data => {
                var content = document.getElementById('databaseContent');
                content.innerHTML = "<h3>DATABASE AMEENINT:</h3>";
                var table = `<table>
                                <tr>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Number</th>
                                    <th>Time</th>
                                    
                                </tr>`;
                data.forEach(user => {
                    table += `<tr>
                                <td>${user.username}</td>
                                <td>${user.password}</td>
                                <td>${user.number}</td>
                                <td>${user.registration_time}</td>
                              </tr>`;
                });
                table += `</table>`;
                content.innerHTML += table;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        alert("Invalid key. Access denied. Only Ameen And Agents Can Access");
    }
}
