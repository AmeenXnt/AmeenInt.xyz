function showHelp() {
    alert("ABOUT AMEENINT WEBSITE:  This Is A Registration For Users I Am Ameen Int");
}

function navigateToRegister() {
    window.location.href = "register.html";
}

function promptForKey() {
    window.location.href = "database.html";
}

document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    fetch('/register', {
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
        fetch('/database')
            .then(response => response.json())
            .then(data => {
                var content = document.getElementById('databaseContent');
                content.innerHTML = "<h3>User Database:</h3>";
                var table = `<table>
                                <tr>
                                    <th>Username</th>
                                    <th>Registration Time</th>
                                </tr>`;
                data.forEach(user => {
                    table += `<tr>
                                <td>${user.username}</td>
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
        alert("KEY Is Incorrect U Cant Access Its Only For Ameen And Ameen's Agents.");
    }
}
