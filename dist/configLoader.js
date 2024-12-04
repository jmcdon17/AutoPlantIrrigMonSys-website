const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

function loadConfig() {
    try {
        const configFile = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configFile);
    } catch (err) {
        console.error('Error reading configuration file:', err);
        process.exit(1);
    }
}

module.exports = loadConfig();