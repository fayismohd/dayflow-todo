
// =================================
// 1. SELECT HTML ELEMENTS
// =================================

const taskList = document.getElementById("task-list");
const taskModal = document.getElementById("task-modal");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

const taskCategory = document.getElementById("task-category");
const taskPriority = document.getElementById("task-priority");

const newTaskBtn = document.getElementById("new-task-btn");
const cancelModalBtn = document.getElementById("cancel-modal");

const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const progressCount = document.getElementById("progress-count");

const taskSummary = document.getElementById("task-summary");

const clearCompletedBtn = document.getElementById("clear-completed");

const weeklyText = document.getElementById("weekly-text");
const weeklyPercent = document.getElementById("weekly-percent");
const weeklyProgress = document.getElementById("weekly-progress");


// =================================
// 2. TASK DATA
// =================================

let tasks = JSON.parse(localStorage.getItem("dayflow-tasks")) || [];

let currentFilter = "all";
let editingTaskId = null;


// =================================
// 3. SAVE TASKS
// =================================

function saveTasks() {
  localStorage.setItem("dayflow-tasks", JSON.stringify(tasks));
}


// =================================
// 4. OPEN AND CLOSE MODAL
// =================================

function openModal() {
  taskModal.classList.remove("hidden");
  taskModal.classList.add("flex");
  taskInput.focus();
}

function closeModal() {
  taskModal.classList.add("hidden");
  taskModal.classList.remove("flex");

  taskForm.reset();
  editingTaskId = null;

  document.getElementById("modal-title").textContent = "Create new task";
  document.getElementById("save-task-btn").textContent = "Add task";
}

newTaskBtn.addEventListener("click", openModal);

cancelModalBtn.addEventListener("click", closeModal);


// =================================
// 5. ADD OR UPDATE TASK
// =================================

taskForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) return;

  if (editingTaskId !== null) {

    tasks = tasks.map(task => {
      if (task.id === editingTaskId) {
        return {
          ...task,
          title: title,
          category: taskCategory.value,
          priority: taskPriority.value
        };
      }

      return task;
    });

  } else {

    const newTask = {
      id: Date.now(),
      title: title,
      category: taskCategory.value,
      priority: taskPriority.value,
      completed: false
    };

    tasks.unshift(newTask);
  }

  saveTasks();
  renderTasks();
  closeModal();
});


// =================================
// 6. DISPLAY TASKS
// =================================

function renderTasks() {

  taskList.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();

  let filteredTasks = tasks.filter(task => {

    const matchesSearch =
      task.title.toLowerCase().includes(searchValue) ||
      task.category.toLowerCase().includes(searchValue);

    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed) ||
      (currentFilter === "upcoming" && !task.completed);

    return matchesSearch && matchesFilter;
  });


  if (filteredTasks.length === 0) {

    taskList.innerHTML = `
      <div class="text-center py-12">
        <p class="text-3xl mb-3">📝</p>
        <p class="text-sm font-medium text-slate-600">
          No tasks found
        </p>
        <p class="text-xs text-slate-400 mt-1">
          Add a new task to get started.
        </p>
      </div>
    `;

  }


  filteredTasks.forEach(task => {

    const taskElement = document.createElement("div");

    taskElement.className =
      "flex items-center gap-3 py-4 group";

    const priorityColors = {
      High: "bg-red-50 text-red-500",
      Medium: "bg-orange-50 text-orange-500",
      Low: "bg-emerald-50 text-emerald-500"
    };

    const completedStyle = task.completed
      ? "line-through text-slate-400"
      : "text-slate-700";

    taskElement.innerHTML = `
      <input
        type="checkbox"
        class="task-checkbox accent-violet-600 w-4 h-4 cursor-pointer shrink-0"
        ${task.completed ? "checked" : ""}
      >

      <div class="flex-1 min-w-0">
        <p class="text-xs font-medium ${completedStyle} task-title"></p>

        <p class="text-[9px] text-slate-400 mt-1">
          ${task.category}
        </p>
      </div>

      <span class="text-[9px] px-3 py-1 rounded-md ${priorityColors[task.priority] || priorityColors.Medium}">
        ${task.priority}
      </span>

      <div class="relative">
        <button class="more-btn text-slate-400 px-2 py-1 hover:bg-slate-100 rounded">
          •••
        </button>

        <div class="task-menu hidden absolute right-0 top-8 bg-white shadow-lg border border-slate-100 rounded-lg w-28 z-10">
          <button class="edit-btn block w-full text-left px-3 py-2 text-xs hover:bg-slate-50">
            Edit
          </button>
          <button class="delete-btn block w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-slate-50">
            Delete
          </button>
        </div>
      </div>
    `;

    // Safely insert the task title
    taskElement.querySelector(".task-title").textContent = task.title;


    // COMPLETE TASK
    const checkbox = taskElement.querySelector(".task-checkbox");

    checkbox.addEventListener("change", function() {

      task.completed = checkbox.checked;

      saveTasks();
      renderTasks();

    });


    // SHOW MENU
    const moreBtn = taskElement.querySelector(".more-btn");
    const taskMenu = taskElement.querySelector(".task-menu");

    moreBtn.addEventListener("click", function() {

      taskMenu.classList.toggle("hidden");

    });


    // EDIT TASK
    const editBtn = taskElement.querySelector(".edit-btn");

    editBtn.addEventListener("click", function() {

      editingTaskId = task.id;

      taskInput.value = task.title;
      taskCategory.value = task.category;
      taskPriority.value = task.priority;

      document.getElementById("modal-title").textContent = "Edit task";
      document.getElementById("save-task-btn").textContent = "Save changes";

      openModal();

    });


    // DELETE TASK
    const deleteBtn = taskElement.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function() {

      tasks = tasks.filter(item => item.id !== task.id);

      saveTasks();
      renderTasks();

    });


    taskList.appendChild(taskElement);

  });


  updateStatistics();

}


// =================================
// 7. UPDATE STATISTICS
// =================================

function updateStatistics() {

  const total = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  const active = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  progressCount.textContent = active;

  taskSummary.textContent =
    `Showing ${tasks.length} tasks`;

  const percentage = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  weeklyText.textContent = `${completed} of ${total} tasks done`;
  weeklyPercent.textContent = `${percentage}%`;

  weeklyProgress.style.width = `${percentage}%`;

}


// =================================
// 8. FILTER TASKS
// =================================

filterButtons.forEach(button => {

  button.addEventListener("click", function() {

    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.remove("active-filter");
    });

    button.classList.add("active-filter");

    renderTasks();

  });

});


// =================================
// 9. SEARCH TASKS
// =================================

searchInput.addEventListener("input", function() {

  renderTasks();

});


// =================================
// 10. CLEAR COMPLETED TASKS
// =================================

clearCompletedBtn.addEventListener("click", function() {

  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();

});


// =================================
// 11. CURRENT DATE
// =================================

const today = new Date();

document.getElementById("current-date").textContent =
  today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });


// =================================
// 12. INITIALIZE APP
// =================================

renderTasks();
