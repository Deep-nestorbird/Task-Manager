const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 30027;
;

app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection configuration 
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL database', err));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
});





app.post('/save-task', (req, res) => {
    const { date, task , status } = req.body; // Extract date and task from request body
    console.log('Received task data:', { date, task , status}); // Debugging
    
    const query = 'INSERT INTO tasks (date, task, status) VALUES ($1, $2 , $3)';
    const values = [date, task , status];
    
    client.query(query, values)
        .then(() => {
            console.log('Task saved successfully');
            res.json({ success: true });
        })
        .catch(err => {
            console.error('Error saving task:', err);
            res.status(500).json({ success: false, error: err.message });
        });
});

// Start the server

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
});
function highlightCurrentDate() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    
    // Find the cell corresponding to the current date
    const cells = document.querySelectorAll('.day');
    cells.forEach(cell => {
        const cellDate = new Date(cell.dataset.date);
        if (cellDate.getFullYear() === currentYear && 
            cellDate.getMonth() === currentMonth && 
            cellDate.getDate() === currentDay) {
            cell.classList.add('current-date'); // Add CSS class to highlight
        }
    });
}

// Call the function to highlight the current date
highlightCurrentDate();


