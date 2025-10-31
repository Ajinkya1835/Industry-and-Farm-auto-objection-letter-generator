import express from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware to parse JSON and enable CORS
app.use(cors());
app.use(express.json());

// CSV writer configuration
const csvFilePath = path.join(__dirname, 'submissions.csv');
const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'ownerName', title: 'Owner Name' },
        { id: 'ownerEmail', title: 'Owner Email' },
        { id: 'ownerContactNumber', title: 'Owner Contact Number' },
        { id: 'propertyIdentifier', title: 'Property Identifier' },
        { id: 'entityType', title: 'Entity Type' },
        { id: 'locationCity', title: 'Location City' },
        { id: 'locationState', title: 'Location State' },
        { id: 'dateObserved', title: 'Date Observed' },
        { id: 'violationDescription', title: 'Violation Description' },
        { id: 'complainantName', title: 'Complainant Name' },
        { id: 'complainantEmail', title: 'Complainant Email' },
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'submissionId', title: 'Submission ID' }
    ],
    append: true
});

// Check if CSV file exists, if not, write header
if (!fs.existsSync(csvFilePath)) {
    csvWriter.writeRecords([]); // This will create the file with header
}

// POST endpoint to handle form submissions
app.post('/submit', async (req, res) => {
    try {
        const formData = req.body;

        // Append the data to CSV
        await csvWriter.writeRecords([formData]);

        console.log('Submission saved to CSV:', formData);
        res.status(200).json({ message: 'Submission saved successfully' });
    } catch (error) {
        console.error('Error saving to CSV:', error);
        res.status(500).json({ message: 'Error saving submission' });
    }
});

// GET endpoint for root to serve fr.html or a simple message
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'fr.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
