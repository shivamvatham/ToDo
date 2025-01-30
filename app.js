// Get references to the DOM elements
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const showAll = document.getElementById('showAll');
const showCompleted = document.getElementById('showCompleted');
const showIncomplete = document.getElementById('showIncomplete');
const clearAll = document.getElementById('clearAll');

// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Function to load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.date, task.completed);
    });
    applyFilter('all'); // Show all tasks by default
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDueDate = taskDate.value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Add the task to the DOM
    addTaskToDOM(taskText, taskDueDate, false);

    // Save tasks to local storage
    saveTasks();

    // Clear the input fields
    taskInput.value = '';
    taskDate.value = '';
}

// Function to add a task to the DOM
function addTaskToDOM(taskText, taskDueDate, isCompleted) {
    const li = document.createElement('li');
    if (isCompleted) {
        li.classList.add('completed');
    }

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    const taskDateSpan = document.createElement('span');
    taskDateSpan.className = 'task-date';
    taskDateSpan.textContent = taskDueDate ? `(Due: ${taskDueDate})` : '';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const completeButton = document.createElement('button');
    completeButton.textContent = isCompleted ? 'Undo' : 'Complete';
    completeButton.addEventListener('click', () => {
        li.classList.toggle('completed');
        completeButton.textContent = li.classList.contains('completed') ? 'Undo' : 'Complete';
        saveTasks();
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        const newText = prompt('Edit your task:', taskSpan.textContent);
        if (newText !== null && newText.trim() !== '') {
            taskSpan.textContent = newText.trim();
            saveTasks();
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(li);
        saveTasks();
    });

    actions.appendChild(completeButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    li.appendChild(taskSpan);
    li.appendChild(taskDateSpan);
    li.appendChild(actions);
    taskList.appendChild(li);
}

// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            date: li.querySelector('.task-date').textContent.replace('(Due: ', '').replace(')', ''),
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to filter tasks
function applyFilter(filter) {
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
        switch (filter) {
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'incomplete':
                task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
                break;
            default:
                task.style.display = 'flex';
                break;
        }
    });
}

// Event listeners for filter buttons
showAll.addEventListener('click', () => {
    applyFilter('all');
    showAll.classList.add('active');
    showCompleted.classList.remove('active');
    showIncomplete.classList.remove('active');
});

showCompleted.addEventListener('click', () => {
    applyFilter('completed');
    showCompleted.classList.add('active');
    showAll.classList.remove('active');
    showIncomplete.classList.remove('active');
});

showIncomplete.addEventListener('click', () => {
    applyFilter('incomplete');
    showIncomplete.classList.add('active');
    showAll.classList.remove('active');
    showCompleted.classList.remove('active');
});

// Event listener for clearing all tasks
clearAll.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
    }
});

// Event listener for adding a task
addTaskButton.addEventListener('click', addTask);

// Allow pressing "Enter" to add a task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
