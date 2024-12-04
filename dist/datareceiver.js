const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./configLoader');

// Add CORS headers middleware
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Constants
const HEADER = 'time,temperature,humidity,water,soilmoisture\n';
const FILE_PATH = path.join(__dirname, 'datalogs.csv');
const configPath = path.join(__dirname, 'config.json');

// Variables from config
let MAX_LINES = config.maxLines;
let UPDATE_INTERVAL = config.interval;
let PORT = config.port;

// Helper functions
function ensureHeaderExists(filePath, header, callback) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(filePath, header, callback);
        } else {
            callback(null);
        }
    });
}

function limitFileSize(filePath, maxLines, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return callback(err);

        const lines = data.trim().split('\n');
        if (lines.length > maxLines + 1) {
            const newData = [lines[0]].concat(lines.slice(lines.length - maxLines)).join('\n') + '\n';
            fs.writeFile(filePath, newData, callback);
        } else {
            callback(null);
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    setCorsHeaders(res);
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'POST' && req.url === '/datareceiver') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            ensureHeaderExists(FILE_PATH, HEADER, (err) => {
                if (err) {
                    console.error('Error ensuring header:', err);
                    res.writeHead(500);
                    return res.end('Internal Server Error');
                }

                fs.appendFile(FILE_PATH, body + '\n', (err) => {
                    if (err) {
                        console.error('Error writing data:', err);
                        res.writeHead(500);
                        return res.end('Internal Server Error');
                    }

                    limitFileSize(FILE_PATH, MAX_LINES, (err) => {
                        if (err) {
                            console.error('Error limiting file size:', err);
                            res.writeHead(500);
                            return res.end('Internal Server Error');
                        }
                        res.writeHead(200);
                        res.end('Data received and stored');
                    });
                });
            });
        });
    } else if (req.method === 'POST' && req.url === '/config') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const newConfig = JSON.parse(body);
                fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing configuration:', err);
                        res.writeHead(500);
                        return res.end('Internal Server Error');
                    }

                    MAX_LINES = newConfig.maxLines;
                    UPDATE_INTERVAL = newConfig.interval;
                    PORT = newConfig.port;

                    res.writeHead(200);
                    res.end('Settings saved successfully');
                });
            } catch (err) {
                console.error('Error parsing configuration:', err);
                res.writeHead(400);
                res.end('Invalid configuration data');
            }
        });
    } else if (req.method === 'GET' && req.url === '/config') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(config));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});