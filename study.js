const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progress-text");

document.addEventListener("DOMContentLoaded", loadTasks);

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const subject = document.getElementById("subject").value;
  const time = document.getElementById("time").value;

  const task = { subject, time, completed: false };
  addTask(task);
  saveTask(task);
  updateProgress();

  taskForm.reset();
});

function addTask(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${task.subject} - ${task.time}</span>
    <div class="actions">
      <button class="done-btn">✔</button>
      <button class="delete-btn">✖</button>
    </div>
  `;

  if (task.completed) li.classList.add("completed");

  // Done button
  li.querySelector(".done-btn").addEventListener("click", () => {
    li.classList.toggle("completed");
    toggleTask(task.subject, task.time);
    updateProgress();
  });

  // Delete button
  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    deleteTask(task.subject, task.time);
    updateProgress();
  });

  taskList.appendChild(li);
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTask);
  updateProgress();
}

function toggleTask(subject, time) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => {
    if (t.subject === subject && t.time === time) t.completed = !t.completed;
    return t;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(subject, time) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => !(t.subject === subject && t.time === time));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateProgress() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks.length === 0) {
    progressBar.style.width = "0%";
    progressText.textContent = "0% Complete";
    return;
  }

  let completed = tasks.filter((t) => t.completed).length;
  let percent = Math.round((completed / tasks.length) * 100);

  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Complete`;
}
