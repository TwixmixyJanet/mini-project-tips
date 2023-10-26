const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');
const diagnostics = require('./db/diagnostics.json');
const fs = require('fs');
const { json } = require('body-parser');

const PORT = process.env.PORT || 3001; // Change "port" to "PORT"

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html')
));

// GET Route for feedback page
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/feedback.html')
));

// GET Route for API Diagnostics
app.get('/api/diagnostics', (req, res) => {
  return res.json(diagnostics);
});

// POST Route
app.post('/api/diagnostics', (req, res) => {
  res.json(`${req.method} request received`);
  // Needs to store information about the invalid form submission
  const requestData = req.body;
  fs.readFile('db/diagnostics.json', 'utf8', (err, data) => {
    if (err) {
      data = []; // Initialize data as an empty array if the file doesn't exist
    } else {
      data = JSON.parse(data); // Use JSON.parse to parse the existing data
    }
    data.push(requestData);
    fs.writeFile('db/diagnostics.json', JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging data');
      } else {
        res.send('Data logged successfully');
      }
    });
  });
});

// GET Route for wildcard
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'./public/pages/404.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);