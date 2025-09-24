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
            li.classList.add('task-item-enter');
            
            if (task.done) {
                li.classList.add('task-completed');
            }
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done || false;
            checkbox.addEventListener('change', async () => {
                li.classList.add('loading');
                try {
                    await updateTask(task.id, { done: checkbox.checked });
                    renderTasks();
                } catch (error) {
                    console.error('Error updating task:', error);
                    li.classList.remove('loading');
                }
            });

            const titleContainer = document.createElement('div');
            titleContainer.classList.add('task-title-container');
            
            const titleSpan = document.createElement('span');
            titleSpan.textContent = task.title;

            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = task.title;
            titleInput.style.display = 'none';

            titleContainer.appendChild(titleSpan);
            titleContainer.appendChild(titleInput);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('task-buttons');

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'Edit';
            let isEditing = false;

            editBtn.addEventListener('click', async () => {
                if (!isEditing) {
                    titleSpan.style.display = 'none';
                    titleInput.style.display = 'block';
                    editBtn.textContent = 'Save';
                    editBtn.classList.add('save-mode');
                    titleInput.focus();
                    titleInput.select();
                    isEditing = true;
                } else {
                    const newTitle = titleInput.value.trim();
                    if (newTitle && newTitle !== task.title) {
                        editBtn.classList.add('loading');
                        try {
                            await updateTask(task.id, { title: newTitle });
                            renderTasks();
                        } catch (error) {
                            console.error('Error updating task:', error);
                            editBtn.classList.remove('loading');
                        }
                    } else {
                        titleSpan.style.display = 'block';
                        titleInput.style.display = 'none';
                        editBtn.textContent = 'Edit';
                        editBtn.classList.remove('save-mode');
                        isEditing = false;
                    }
                }
            });

            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    editBtn.click();
                } else if (e.key === 'Escape') {
                    titleSpan.style.display = 'block';
                    titleInput.style.display = 'none';
                    titleInput.value = task.title; 
                    editBtn.textContent = 'Edit';
                    editBtn.classList.remove('save-mode');
                    isEditing = false;
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    li.classList.add('task-item-exit');
                    try {
                        await deleteTask(task.id);
                        setTimeout(() => {
                            renderTasks();
                        }, 300); 
                    } catch (error) {
                        console.error('Error deleting task:', error);
                        li.classList.remove('task-item-exit');
                    }
                }
            });

            buttonsContainer.appendChild(editBtn);
            buttonsContainer.appendChild(deleteBtn);

            li.appendChild(checkbox);
            li.appendChild(titleContainer);
            li.appendChild(buttonsContainer);
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
        const submitBtn = addTaskForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Adding...';
        
        try {
            await createTask(title);
            taskTitleInput.value = '';
            renderTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Add Task';
        }
    }
});

renderTasks();