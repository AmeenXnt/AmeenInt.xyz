function saveQuote(username) {
    var quote = document.getElementById(`${username}-quoteInput`).value;
    var author = document.getElementById(`${username}-authorInput`).value;
    var quoteDiv = document.getElementById(`${username}-quotes`);
    
    // Save quote and author to database or local storage
    // Example: fetch('/saveQuote', { method: 'POST', body: JSON.stringify({ username, quote, author }) })
    //          .then(response => response.json())
    //          .then(data => {
    //              if (data.success) {
    //                  quoteDiv.innerHTML += `<p>${quote} - ${author}</p>`;
    //              } else {
    //                  alert(data.message);
    //              }
    //          })
    //          .catch((error) => {
    //              console.error('Error:', error);
    //          });
    
    // For demonstration, just append the quote to the page
    quoteDiv.innerHTML += `<p>${quote} - ${author}</p>`;
}

// Function to fetch saved quotes from database or local storage
function fetchSavedQuotes() {
    // Fetch saved quotes from database or local storage
    // Example: fetch('/fetchQuotes')
    //          .then(response => response.json())
    //          .then(data => {
    //              // Display saved quotes on the page
    //          })
    //          .catch((error) => {
    //              console.error('Error:', error);
    //          });
    
    // For demonstration, just display dummy quotes
    var savedQuotesDiv = document.getElementById('savedQuotes');
    savedQuotesDiv.innerHTML = "<h2>Saved Quotes</h2>";
    savedQuotesDiv.innerHTML += "<p>Quote 1 - Author 1</p>";
    savedQuotesDiv.innerHTML += "<p>Quote 2 - Author 2</p>";
    savedQuotesDiv.innerHTML += "<p>Quote 3 - Author 3</p>";
}

// Call the fetchSavedQuotes function when the page loads
fetchSavedQuotes();
