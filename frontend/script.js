import { getAllTasks, createTask, deleteTask, updateTask } from './api.js';

const taskList = document.getElementById('taskList');
const addTaskForm = document.getElementById('addTaskForm');
const taskTitleInput = document.getElementById('taskTitle');

async function renderTasks() {
    try {
        taskList.innerHTML = ''; 
        const tasks = await getAllTasks();
        tasks.forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done || false;
            checkbox.addEventListener('change', async () => {
                await updateTask(task.id, { done: checkbox.checked });
                renderTasks();
            });

            const titleContainer = document.createElement('div');
            titleContainer.style.display = 'inline-block';
            
            const titleSpan = document.createElement('span');
            titleSpan.textContent = task.title;

            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = task.title;
            titleInput.style.display = 'none';

            titleContainer.appendChild(titleSpan);
            titleContainer.appendChild(titleInput);

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            let isEditing = false;

            editBtn.addEventListener('click', async () => {
                if (!isEditing) {
                    titleSpan.style.display = 'none';
                    titleInput.style.display = 'block';
                    editBtn.textContent = 'Save';
                    titleInput.focus();
                    isEditing = true;
                } else {
                    const newTitle = titleInput.value.trim();
                    if (newTitle && newTitle !== task.title) {
                        await updateTask(task.id, { title: newTitle });
                        renderTasks();
                    } else {
                        titleSpan.style.display = 'block';
                        titleInput.style.display = 'none';
                        editBtn.textContent = 'Edit';
                        isEditing = false;
                    }
                }
            });

            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    editBtn.click();
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', async () => {
                await deleteTask(task.id);
                renderTasks();
            });

            li.appendChild(checkbox);
            li.appendChild(titleContainer);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error rendering tasks:', error);
    }
}

addTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    if (title) {
        await createTask(title);
        taskTitleInput.value = '';
        renderTasks();
    }
});

renderTasks();