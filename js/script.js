

// ===============================
// Smart Task Manager
// Part 1
// ===============================

// Selecting HTML Elements

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const quote = document.getElementById("quote");
const filterButtons = document.querySelectorAll(".filter-btn");

// Store Tasks

let tasks = [];
let currentFilter = "all";

// Load Tasks

window.onload = () => {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {

        tasks = JSON.parse(savedTasks);

    }

    fetchQuote();

    displayTasks();

};

// Add Task

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {

        alert("Please enter a task.");

        return;

    }

    const task = {

        id: Date.now(),

        text: taskText,

        inAll: true,

        pending: false,

        completed: false

    };

    tasks.push(task);

    saveTasks();

    displayTasks();

    taskInput.value = "";

    taskInput.focus();

}

// Display Tasks

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [];

    if (currentFilter === "all") {

        filteredTasks = tasks.filter(task => task.inAll);

    }

    else if (currentFilter === "pending") {

        filteredTasks = tasks.filter(task => task.pending);

    }

    else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }

    emptyMessage.style.display = "none";

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;

        if (currentFilter === "completed" || (currentFilter === "all" && task.completed)) {

            taskText.classList.add("completed");

        }

        const buttonContainer = document.createElement("div");

        buttonContainer.className = "task-buttons";

        // Complete Button

        const completeBtn = document.createElement("button");

        completeBtn.className = "complete-btn";

        completeBtn.textContent = "✔";

        // Wrong Button

        const wrongBtn = document.createElement("button");

        wrongBtn.className = "delete-btn";

        wrongBtn.textContent = "✖";


                // Tick Button Action

        completeBtn.addEventListener("click", () => {

            if (currentFilter === "all") {

                // Stay in All + Add to Completed

                task.completed = true;

            }

            else if (currentFilter === "pending") {

                // Move Pending -> Completed

                task.pending = false;

                task.completed = true;

            }

            else if (currentFilter === "completed") {

                // Stay in Completed

                task.completed = true;

            }

            saveTasks();

            displayTasks();

        });

        // Wrong Button Action

        wrongBtn.addEventListener("click", () => {

            if (currentFilter === "all") {

                // Move All -> Pending

                task.inAll = false;

                task.pending = true;

                task.completed = false;

            }

            else if (currentFilter === "pending") {

                // Delete Permanently

                tasks = tasks.filter(t => t.id !== task.id);

            }

            else if (currentFilter === "completed") {

                // Move Completed -> Pending + All

                task.completed = false;

                task.pending = true;

                task.inAll = true;

            }

            saveTasks();

            displayTasks();

        });

        buttonContainer.appendChild(completeBtn);

        buttonContainer.appendChild(wrongBtn);

        li.appendChild(taskText);

        li.appendChild(buttonContainer);

        taskList.appendChild(li);

    });

}

// Save Tasks

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Filter Buttons

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});

// Fetch Quote

async function fetchQuote() {

    try {

        const response = await fetch("https://api.adviceslip.com/advice");

        const data = await response.json();

        quote.textContent = `"${data.slip.advice}"`;

    }

    catch (error) {

        quote.textContent = '"Believe in yourself and keep moving forward."';

    }

}