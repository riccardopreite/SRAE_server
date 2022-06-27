const dotenv = require('dotenv');

// Environment loading
dotenv.config();


const serverPort = process.env.SERVER_PORT === undefined ? '3000' : process.env.SERVER_PORT;
const api_url = process.env.API_URL === undefined ? 'http://localhost:3001/' : process.env.API_URL;

function printConfiguration() {
    console.info('HTTPS Server port: ' + serverPort);
}

const index = {
    printConfiguration,
    serverPort,
    api_url
};

module.exports = index;