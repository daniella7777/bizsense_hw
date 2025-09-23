const http = require('http');
const { getTasks } = require('./controller');

const server = http.createServer((req, res)=>{
    if(req.method === 'GET'){
        getTasks(req,res);
    }
    // else if(req.method === 'POST'){
    //     postTask(req, res);
    // } else if(req.method === 'DELETE' || req.method === 'PUT'){
    //     const id = req.url.split('/')[2];
    //     req.method === 'DELETE' ? deleteTask(req, res, id) : markTask((req, res, id));
    // }else {
    //     res.writeHead(404, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: 'Route not found' }));
    //   }
});

server.listen(8080, '127.0.0.1', () => {
    console.log('Listening to requests on port 8080');
  });