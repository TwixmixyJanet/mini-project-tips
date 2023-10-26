const diagnostics = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

// Define the path to the diagnostics JSON file
const diagnosticsFilePath = 'path_to_diagnostics.json'; // Replace with the actual path

// GET Route for retrieving diagnostic information
diagnostics.get('/', (req, res) => {
  // Read the diagnostics data from the JSON file and send it as a response
  readFromFile(diagnosticsFilePath).then((data) => {
    res.json(data);
  });
});

// POST Route for error logging
diagnostics.post('/', (req, res) => {
  // Extract the data from the request and add a unique ID
  const { data } = req.body;
  const id = uuidv4();
  const newDiagnosticEntry = { id, data };

  // Append the new diagnostic entry to the JSON file
  readAndAppend(diagnosticsFilePath, newDiagnosticEntry).then(() => {
    res.json({ message: 'Data logged successfully' });
  });
});

module.exports = diagnostics;
