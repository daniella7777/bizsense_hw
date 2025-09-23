const Task = require('./model');
const { getPostData } = require('./utils');

async function getTasks(req, res) {
    try {
        const tasks = await Task.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } catch (error) {
        console.log(error)
    }
}

async function postTask(req, res) {
    try {
        const body = await getPostData(req);
        let taskData;
        try {
            taskData = JSON.parse(body);
        } catch (parseError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
        }
        if (!taskData || typeof taskData !== 'object') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Task data is required' }));
            return;
        }
        if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim().length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Title is required and must be a non empty string' }));
            return;
        }
        const newTask = await Task.createTask(taskData);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newTask));
    } catch (error) {
        console.error('Error creating task:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}


module.exports = {
    getTasks,
    postTask
};