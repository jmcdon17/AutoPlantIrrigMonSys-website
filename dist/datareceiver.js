const http = require('http');
const fs = require('fs');
const path = require('path');

const HEADER = 'time,temperature,humidity,water,soilmoisture\n';
const FILE_PATH = path.join(__dirname, 'datalogs.csv');

// Ensure the header exists in the CSV file
function ensureHeaderExists(filePath, header, callback) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(filePath, header, callback);
        } else {
            callback(null);
        }
    });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/datareceiver') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            ensureHeaderExists(FILE_PATH, HEADER, (err) => {
                if (err) {
                    console.error('Error ensuring header:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                fs.appendFile(FILE_PATH, body + '\n', (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Data received and logged');
                });
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});