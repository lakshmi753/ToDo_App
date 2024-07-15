const createTaskBtn = document.querySelector(".create-task-btn");
const btnText = createTaskBtn.innerText;
const enterTask = document.querySelector(".enter-task");
const taskBox = document.querySelector(".task-box");
const totalTask = document.querySelector(".total--task");
const clearListBtn = document.querySelector(".clear--btn");

let edit_id = null;

let todoArr = [];

getLocalStorage();

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function setLocalStorage(todoArr) {
  localStorage.setItem("todoArr", JSON.stringify(todoArr));

  totalTask.textContent = `Total Task - ${todoArr?.length}`;
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("todoArr"));

  if (!data) return;

  todoArr = data;

  totalTask.textContent = `Total Task - ${todoArr.length}`;

  displayTask();
}

function handleCreateTask() {
  if (!enterTask.value) return;

  const taskk = enterTask.value.toUpperCase();
  const task = taskk[0] + taskk.slice(1).toLowerCase();

  const id = (Date.now() + "").slice(-10);
  const date = new Date();

  let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let seconds =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  const time = `${date.getDate()} ${
    months[date.getMonth()]
  }, ${hours}:${minutes}:${seconds} ${hours >= 0 && hours < 12 ? "AM" : "PM"}`;

  if (edit_id !== null) {
    todoArr.splice(edit_id, 1, { task: task, time: time, id: id });

    edit_id = null;
  } else {
    todoArr.push({ task, time, id });
  }

  setLocalStorage(todoArr);

  enterTask.value = "";

  createTaskBtn.innerText = btnText;

  displayTask();
}

createTaskBtn.addEventListener("click", handleCreateTask);

function displayTask() {
  let html = "";
  todoArr.forEach((taskObj, i) => {
    html += `
    <div class="tasks hidden taskk" data-id="${taskObj.id}">
       <div class="pin-task taskk" id="${taskObj.id}">🗓️ ${taskObj.time} : 📌 ${taskObj.task}</div>
       <div class="task--btns taskk">
         <button class="btns done--btn  taskk" id="${taskObj.id}" onclick="task_done(this)">Done ☑️</button>
         <button class="btns edit--btn taskk" onclick="task_edit(${i})">Edit 🖋️</button>
         <button class="btns delete--btn taskk" id="${taskObj.id}" onclick="task_delete(this, ${i})">Remove task 🗑️</button>
       </div>
     </div>`;
  });
  taskBox.innerHTML = html;
}

function task_done(e) {
  const id = e.getAttribute("id");

  const pinTask = document.getElementById(id);

  pinTask.classList.toggle("finish-task");
}

function task_edit(i) {
  edit_id = i;
  enterTask.value = todoArr[i].task;
  enterTask.focus();
  createTaskBtn.innerText = "Save Changes";
}

function task_delete(e, i) {
  const id = e.getAttribute("id");

  const pinTask = document.getElementById(id);

  if (pinTask.classList.contains("finish-task")) {
    todoArr.splice(i, 1);

    setLocalStorage(todoArr);

    displayTask();
  } else {
    alert("First finish your task please ☺️");
  }
}

clearListBtn.addEventListener("click", function () {
  if (todoArr.length === 0) return;

  const confirmed = confirm("Do you really want to clear your task list 😯 ?");

  if (confirmed) {
    todoArr = [];
    setLocalStorage(todoArr);

    displayTask();
  }
});
