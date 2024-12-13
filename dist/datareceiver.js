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
const plantDatabasePath = path.join(__dirname, 'plantDatabase.csv');
const PLANT_DB_HEADER = 'id,name,maxLines,interval,port,soilMoistureThreshold\n';

// Variables from config
let MAX_LINES = config.maxLines;
let UPDATE_INTERVAL = config.interval;
let PORT = config.port;
let SOIL_MOISTURE_THRESHOLD = config.soilmoisturethreshold;

// Helper functions
function ensureHeaderExists(filePath, header, callback) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(filePath, header, callback);
        } else {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return callback(err);
                if (!data.startsWith(header)) {
                    fs.writeFile(filePath, header + data, callback);
                } else {
                    callback(null);
                }
            });
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

function ensurePlantDatabaseExists(callback) {
    fs.readFile(plantDatabasePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist, create it with the header
                return fs.writeFile(plantDatabasePath, PLANT_DB_HEADER, callback);
            } else {
                return callback(err);
            }
        }

        const lines = data.split('\n').filter(line => line.trim() !== '');
        if (!lines[0].startsWith('id,name,maxLines,interval,port,soilMoistureThreshold')) {
            // Add header if missing
            const newData = [PLANT_DB_HEADER].concat(lines).join('\n') + '\n';
            return fs.writeFile(plantDatabasePath, newData, callback);
        }

        // Remove any duplicate headers
        const filteredLines = lines.filter((line, index) => {
            return index === 0 || !line.startsWith('id,name,maxLines,interval,port,soilMoistureThreshold');
        });
        const newData = filteredLines.join('\n') + '\n';
        fs.writeFile(plantDatabasePath, newData, callback);
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
                    SOIL_MOISTURE_THRESHOLD = newConfig.soilmoisturethreshold;

                    limitFileSize(FILE_PATH, MAX_LINES, (err) => {
                        if (err) {
                            console.error('Error limiting file size:', err);
                            res.writeHead(500);
                            return res.end('Internal Server Error');
                        }
                        res.writeHead(200);
                        res.end('Settings saved successfully');
                    });
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
    } else if (req.method === 'POST' && req.url === '/addPlant') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const newPlant = JSON.parse(body);
                ensurePlantDatabaseExists((err) => {
                    if (err) {
                        console.error('Error ensuring plant database:', err);
                        res.writeHead(500);
                        return res.end('Internal Server Error');
                    }

                    fs.readFile(plantDatabasePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading plant database:', err);
                            res.writeHead(500);
                            return res.end('Internal Server Error');
                        }

                        const rows = data.trim().split('\n');
                        const lastRow = rows[rows.length - 1];
                        const lastId = parseInt(lastRow.split(',')[0]);
                        const newId = lastId + 1;

                        const newRow = `${newId},${newPlant.name},${newPlant.maxLines},${newPlant.interval},${newPlant.port},${newPlant.soilmoisturethreshold}\n`;
                        fs.appendFile(plantDatabasePath, newRow, (err) => {
                            if (err) {
                                console.error('Error writing to plant database:', err);
                                res.writeHead(500);
                                return res.end('Internal Server Error');
                            }

                            res.writeHead(200);
                            res.end('Plant added successfully');
                        });
                    });
                });
            } catch (err) {
                console.error('Error parsing plant data:', err);
                res.writeHead(400);
                res.end('Invalid plant data');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});