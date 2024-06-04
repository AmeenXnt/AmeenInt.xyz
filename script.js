function showHelp() {
    alert("This is the help message. You can add more detailed instructions here.");
}

function navigateToRegister() {
    window.location.href = "register.html";
}

function promptForKey() {
    var key = prompt("Please enter the access key:");
    if (key === "MEERAMEEN$") {
        window.location.href = "database.html";
    } else {
        alert("Invalid key. Access denied.");
    }
}

document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    fetch('./register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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

function checkKey() {
    var key = document.getElementById('keyInput').value;
    if (key === "MEERAMEEN$") {
        fetch('./database')
            .then(response => response.json())
            .then(data => {
                var content = document.getElementById('databaseContent');
                content.innerHTML = "<h3>User Database:</h3>";
                data.forEach(user => {
                    content.innerHTML += `<p>${user.username}</p>`;
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        alert("Invalid key. Access denied.");
    }
}
