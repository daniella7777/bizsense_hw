const { readData, writeData } = require('./utils');
const crypto = require('crypto');

async function findAll() {
    return await readData();
}

async function createTask(task) {
    const tasks = await readData();
    const newTask = {
        id: crypto.randomUUID(),
        ...task,
    };
    tasks.push(newTask);
    await writeData(tasks);
    return newTask;
}


module.exports = {
    findAll,
    createTask
}
