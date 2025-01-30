// Get references to the DOM elements
const taskInput = document.getElementById('taskInput');
const taskDateTime = document.getElementById('taskDateTime');
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
    tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)); // Sort by date and time
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.dateTime, task.completed);
    });
    applyFilter('all'); // Show all tasks by default
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDueDateTime = taskDateTime.value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    // Add the task to the DOM
    addTaskToDOM(taskText, taskDueDateTime, false);

    // Save tasks to local storage
    saveTasks();

    // Clear the input fields
    taskInput.value = '';
    taskDateTime.value = '';
}

// Function to add a task to the DOM
function addTaskToDOM(taskText, taskDueDateTime, isCompleted) {
    const li = document.createElement('li');
    if (isCompleted) {
        li.classList.add('completed');
    }

    // Store the raw dateTime value in a dataset attribute
    li.dataset.datetime = taskDueDateTime;

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    const taskDateTimeSpan = document.createElement('span');
    taskDateTimeSpan.className = 'task-datetime';
    taskDateTimeSpan.textContent = taskDueDateTime ? `(Due: ${formatDateTime(taskDueDateTime)})` : '';

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
    li.appendChild(taskDateTimeSpan);
    li.appendChild(actions);
    taskList.appendChild(li);
}

// Function to format date and time
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString(); // Format as "MM/DD/YYYY, HH:MM:SS AM/PM"
}

// Function to save tasks to local storage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('span').textContent;
        const taskDateTime = li.dataset.datetime; // Retrieve the raw dateTime value from the dataset
        const isCompleted = li.classList.contains('completed');

        tasks.push({
            text: taskText,
            dateTime: taskDateTime, // Store the raw dateTime value
            completed: isCompleted
        });
    });

    // Sort tasks by date and time
    tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    // Save tasks to local storage
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
