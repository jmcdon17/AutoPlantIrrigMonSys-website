const http = require('http');
const fs = require('fs');
const path = require('path');

// Constants
const HEADER = 'time,temperature,humidity,water,soilmoisture\n';
const FILE_PATH = path.join(__dirname, 'datalogs.csv');
const MAX_LINES = 100;

// Ensure the header exists in the CSV file
function ensureHeaderExists(filePath, header, callback) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist, create it with the header
            fs.writeFile(filePath, header, callback);
        } else {
            // File exists, proceed without writing the header
            callback(null);
        }
    });
}

// Limit the size of the CSV file to MAX_LINES
function limitFileSize(filePath, maxLines, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return callback(err);

        const lines = data.trim().split('\n');
        if (lines.length > maxLines + 1) { // +1 to account for the header
            // Keep the header and the last maxLines lines
            const newData = [lines[0]].concat(lines.slice(lines.length - maxLines)).join('\n') + '\n';
            fs.writeFile(filePath, newData, callback);
        } else {
            callback(null);
        }
    });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/datareceiver') {
        let body = '';

        // Collect data chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Process the complete data
        req.on('end', () => {
            // Ensure the header exists in the file
            ensureHeaderExists(FILE_PATH, HEADER, (err) => {
                if (err) {
                    console.error('Error ensuring header:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                // Append the new data to the file
                fs.appendFile(FILE_PATH, body + '\n', (err) => {
                    if (err) {
                        console.error('Error writing data:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }

                    // Limit the file size to MAX_LINES
                    limitFileSize(FILE_PATH, MAX_LINES, (err) => {
                        if (err) {
                            console.error('Error limiting file size:', err);
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                            return;
                        }

                        // Respond with success
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Data received and stored');
                    });
                });
            });
        });
    } else {
        // Handle non-POST or incorrect URL requests
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});