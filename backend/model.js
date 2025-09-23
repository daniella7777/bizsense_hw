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

module.exports = {
    findAll,
    createTask
}
