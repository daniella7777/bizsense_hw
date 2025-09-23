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

async function markAsDone(id) {
    const tasks = await readData();
    const task = tasks.find(task => task.id === id);
    if (!task) {
        console.log('markAsDone - Task not found');
        return null; 
    }
    console.log('markAsDone - Found task:', task);
    task.done = true;
    await writeData(tasks);
    return task;
}

module.exports = {
    findAll,
    createTask,
    markAsDone,
    deleteById
}
