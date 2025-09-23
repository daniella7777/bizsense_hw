const { readData, writeData } = require('./utils');
const crypto = require('crypto');

async function findAll() {
    return await readData();
}

async function createTask(taskData) {
    const tasks = await readData();
    const newTask = {
        id: crypto.randomUUID(),
        title: taskData.title.trim(),
        done: false
    };
    tasks.push(newTask);
    await writeData(tasks);
    return newTask;
}

async function deleteById(id) {
    const tasks = await readData();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return null; 
    }
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    await writeData(tasks);
    return deletedTask;
}

async function updateById(id, updateData) {
    const tasks = await readData();
    const task = tasks.find(task => task.id === id);
    if (!task) {
        console.log('updateById - Task not found');
        return null; 
    } 
    if (updateData.title !== undefined) {
        task.title = updateData.title.trim();
    }
    if (updateData.done !== undefined) {
        task.done = updateData.done;
    }  
    await writeData(tasks);
    console.log('updateById - Updated task:', task);
    return task;
}

module.exports = {
    findAll,
    createTask,
    updateById,
    deleteById
}
