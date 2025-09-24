const Task = require('./model');
const { getPostData } = require('./utils');

async function getTasks(req, res) {
    try {
        const tasks = await Task.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } catch (error) {
        console.log('Error getting tasks', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

function validateId(id, res) {
    if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'ID is required' }));
        return false;
    }
    // Check if ID is a valid UUID v4 format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid ID format - must be a valid UUID' }));
        return false;
    }
    return true; 
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
        if (!taskData.title || typeof taskData.title !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Title is required and must be a non empty string' }));
            return;
        }
        const title = taskData.title.trim();
        const maxLength = 50;
        if (title.length === 0 || title.length > maxLength ||!/^[a-zA-Z\s]+$/.test(title)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Title must be a non empty string with only english letters with 1-${maxLength} characters` }));
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
    updateTask,
    validateId
};