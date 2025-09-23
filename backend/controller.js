const Task = require('./model');
const { getPostData } = require('./utils');

async function getTasks(req, res) {
    try {
        const tasks = await Task.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } catch (error) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
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

async function deleteTask(req, res, id) {
    try {
        const deletedTask = await Task.deleteById(id);
        if (!deletedTask) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Task not found' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task deleted successfully', task: deletedTask }));
    } catch (error) {
        console.error('Error deleting task:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

async function updateTask(req, res, id) {
    try {
        const body = await getPostData(req);
        let updateData;
        try {
            updateData = JSON.parse(body);
        } catch (parseError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
        }
        if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Update data is required' }));
            return;
        }
        if (updateData.title !== undefined) {
            if (typeof updateData.title !== 'string' || updateData.title.trim().length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Title must be a non-empty string' }));
                return;
            }
        }
        if (updateData.done !== undefined && typeof updateData.done !== 'boolean') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Done field must be a boolean' }));
            return;
        }
        const updatedTask = await Task.updateById(id, updateData);
        if (!updatedTask) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Task not found' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedTask));
    } catch (error) {
        console.error('Error updating task:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

module.exports = {
    getTasks,
    postTask,
    deleteTask,
    updateTask
};