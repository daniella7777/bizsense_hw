const fs = require('fs').promises
const path = require('path')

const DATA_FILE = path.join(__dirname, 'tasks.json');

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data); 
    } catch (err) {
        console.error('Error reading file:', err);
        return []; 
    }
}

  async function writeData(filePath, data) {
    try {
      const json = JSON.stringify(data); 
      await fs.writeFile(filePath, json, 'utf8');
    } catch (err) {
      console.error('Error writing file:', err);
    }
  }

function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            })

            req.on('end', () => {
                resolve(body);
            })
        } catch (error) {
            reject(error);
        }
    })
}

        

module.exports = {
    readData,
    writeData,
    getPostData
}