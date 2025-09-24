const http = require('http');
const { getTasks, postTask, deleteTask, updateTask } = require('./controller');

const server = http.createServer((req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
      }
    if(req.method === 'GET'){
        getTasks(req,res);
    }
     else if(req.method === 'POST'){
         postTask(req, res);
     }
     else if(req.method === 'DELETE' || req.method === 'PUT'){
         const id = req.url.split('/')[1];
         if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID is required' }));
            return;
        }
         req.method === 'DELETE' ? deleteTask(req, res, id) : updateTask(req, res, id);
     }else {
         res.writeHead(404, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify({ message: 'Route not found' }));
       }
});

server.listen(8080, '127.0.0.1', () => {
    console.log('Listening to requests on port 8080');
  });