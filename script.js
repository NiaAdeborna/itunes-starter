// preview: python -m http.server
// web storage: https://www.w3schools.com/html/html5_webstorage.asp
// into web storage goes allTasks and a number starting at 1 and then incrementing every new task
// <a href="taskDetail.html?taskId=2">My Important Task</a>

// make createTask function which gets all data from page,
// makes the new Task object and then puts it into allTasks array

// allTasks.push(new Task(.........stuff from page........))

// Class to represent tasks
class Task {
  constructor(id, title, description, dueDate, assignedTo, status = "Incomplete") {
      this.id = id;
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.assignedTo = assignedTo;
      this.status = status;
  }

}

// Initialize allTasks from localStorage or as an empty array
let allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];

// Log in page
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  // Define users and roles
  const users = {
      "Bridgett": { password: "123", role: "manager" },
      "Chris": { password: "123", role: "trainee" },
      "Sarah": { password: "123", role: "trainee" },
      "Finola": { password: "123", role: "trainee" }
  };

  // Check if username exists and the password matches
  if (users[username] && users[username].password === password) {
      localStorage.setItem("loggedInUser", username);
      localStorage.setItem("role", users[username].role); // Store role (manager or trainee)
      localStorage.setItem("username", username); // Store username

      // Redirect user based on their role
      if (users[username].role === "manager") {
          window.location.href = "manager.html"; // Redirect to manager's page
      } else if (users[username].role === "trainee") {
          window.location.href = "trainee.html"; // Redirect to trainee's page
      }
  } else {
      alert("Invalid username or password."); 
  }
}

// Function to set up the trainee page
function setupTraineePage() {
  if(localStorage.getItem("role") === "trainee"){
    document.getElementById("username").textContent = localStorage.getItem("username");
  }

  displayTasks();
}

setupTraineePage();



function createTask() {
  // Get all form input values
  let title = document.getElementById("name").value;
  let description = document.getElementById("description").value;
  let dueDate = document.getElementById("date").value;
  let assignedTo = document.getElementById("trainee").value;

  // Validate form inputs
  if (!title || !description || !dueDate || !assignedTo) {
      alert("Please fill out all fields!");
      return;
  }

  // Generate a new ID based on the current highest ID
  let newTaskId = allTasks.length > 0 ? allTasks[allTasks.length - 1].id + 1 : 1;

  let newTask = new Task(newTaskId, title, description, dueDate, assignedTo);

  allTasks.push(newTask);

  // Store updated allTasks array in localStorage
  localStorage.setItem("allTasks", JSON.stringify(allTasks));

  // Close the task modal and clear form fields
  document.getElementById("modal").style.display = "none"; 
  clearForm(); 

  displayTasks();
}

// editing or creating a task
function saveTask(taskId = null) {
  let title = document.getElementById("name").value;
  let description = document.getElementById("description").value;
  let dueDate = document.getElementById("date").value;
  let assignedTo = document.getElementById("trainee").value;

  // Validate form inputs
  if (!title || !description || !dueDate || !assignedTo) {
      alert("Please fill out all fields!");
      return;
  }

  if (taskId) {
      // Editing an existing task
      let task = allTasks.find(t => t.id === taskId);
      if (task) {
          task.title = title;
          task.description = description;
          task.dueDate = dueDate;
          task.assignedTo = assignedTo;
      }
  } else {
      // Adding a new task
      let newTaskId = allTasks.length > 0 ? allTasks[allTasks.length - 1].id + 1 : 1;
      let newTask = new Task(newTaskId, title, description, dueDate, assignedTo);
      allTasks.push(newTask);
  }

  // Save updated tasks to localStorage
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
  alert("Task saved!");

  // Close modal and refresh task list
  document.getElementById("modal").style.display = "none";
  displayTasks();
}

// Function to set up the manager page
function setupManagerPage() {
  
  // Modal elements
  let modal = document.getElementById("modal");
  let btn = document.getElementById("openTask");
  let span = document.getElementsByClassName("close")[0];
  let saveButton = document.getElementById("saveTaskBtn");

  // Open modal when the Add New Task button is clicked
  btn.addEventListener("click", function () {
      modal.style.display = "block";
      clearForm();
  });

  // Close modal when the user clicks the close button (×)
  span.addEventListener("click", function () {
      modal.style.display = "none";
  });

  // Close modal when the user clicks outside of the modal
  window.addEventListener("click", function (event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  });

  // Save task when the Save Task button is clicked
  saveButton.addEventListener("click", function () {
      saveTask();
  });

  displayTasks();
}

function updateStatus(taskId) {
  const selectedStatus = document.getElementById(`status-${taskId}`).value;

  // Find the task in allTasks array and update its status
  let task = allTasks.find(task => task.id === taskId);
  if (task) {
      task.status = selectedStatus;

      // Save the updated tasks back to localStorage
      localStorage.setItem("allTasks", JSON.stringify(allTasks));

      // Optionally, refresh the task list to reflect changes
      displayTasks();
  }
}



// Function to clear the form (reset input fields)
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("trainee").value = "";
}

function createTaskElement(task, isTrainee = false) {
  let taskElement = document.createElement("div");
  taskElement.classList.add("task-item");

  // Add task details
  taskElement.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p>Due Date: ${task.dueDate}</p>
    <p>Assigned to: ${task.assignedTo}</p>
    <p>Status: ${task.status}</p>
  `;

  if (isTrainee) {
      let statusSelect = document.createElement("select");
      statusSelect.id = `status-${task.id}`;
      statusSelect.addEventListener("change", () => updateStatus(task.id));
      let statuses = ["Incomplete", "Complete"];
      statuses.forEach(status => {
          let option = document.createElement("option");
          option.value = status;
          option.textContent = status;
          if (task.status === status) option.selected = true;
          statusSelect.appendChild(option);
      });
      taskElement.appendChild(statusSelect);
  }

  // Edit and delete button (only for manager)
  if (localStorage.getItem("role") === "manager") {
      let editButton = document.createElement("button");
      let deleteButton = document.createElement("button");

      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editTask(task.id));
      taskElement.appendChild(editButton);

      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteTask(task.id));
      taskElement.appendChild(deleteButton);
  }

  if(localStorage.getItem("role") === "manager"){
    
  }

  return taskElement;
}

// Function to display all tasks for the manager or trainee
function displayTasks() {
  let taskContainer = document.getElementById("taskList");
  taskContainer.innerHTML = "";

  console.log();

  const userRole = localStorage.getItem("role");
  const loggedInUser = localStorage.getItem("loggedInUser");

  allTasks.forEach(task => {
      if (userRole === "manager") {
          let taskItem = createTaskElement(task);
          taskContainer.appendChild(taskItem);
      } 
      else if (userRole === "trainee" && task.assignedTo === loggedInUser) {
          let taskItem = createTaskElement(task, true);
          taskContainer.appendChild(taskItem);
      }
  });
}


// Function to handle task editing
function editTask(taskId) {
  let task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  // Fill the form with the task's existing data
  document.getElementById("name").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("date").value = task.dueDate;
  document.getElementById("trainee").value = task.assignedTo;

  // Show the modal
  document.getElementById("modal").style.display = "block";

  // Change Save button function to edit
  let saveButton = document.getElementById("saveTaskBtn");
  saveButton.onclick = function () {
      saveTask(task.id); // Pass task id to edit
  };
}

// Logout function
function logout() {
  localStorage.removeItem("loggedInUser"); // Remove logged-in user from localStorage
  localStorage.removeItem("role"); // Remove role from localStorage
  window.location.href = "index.html"; // Redirect to login page
}

function deleteTask(taskId){
  allTasks = allTasks.filter(task => task.id !== taskId);

  localStorage.setItem("allTasks", JSON.stringify(allTasks));

  displayTasks();
}

setupManagerPage();
