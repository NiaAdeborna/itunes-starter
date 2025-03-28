document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("role");

    if (!loggedInUser || role !== "trainee") {
        alert("Access Denied! Redirecting to login.");
        window.location.href = "index.html";
    } else {
        document.getElementById("welcomeMessage").textContent = `Welcome, ${loggedInUser}`;
        loadTasks(loggedInUser);
    }
});

function loadTasks(traineeName) {
    const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const traineeTasks = tasks.filter(task => task.assignedTo === traineeName);
    if (traineeTasks.length === 0) {
        taskList.innerHTML = "<p>No tasks assigned yet.</p>";
        return;
    }

    traineeTasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.innerHTML = `
            <h4>${task.title}</h4>
            <p><strong>Due:</strong> ${task.dueDate}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Status:</strong> 
                <select onchange="updateStatus(${task.id}, this.value)">
                    <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </p>
        `;
        taskList.appendChild(taskDiv);
    });
}

function updateStatus(taskId, newStatus) {
    const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.setStatus(newStatus); // Update the task's status
        localStorage.setItem("allTasks", JSON.stringify(tasks)); // Save updated tasks
        alert(`Task status updated to: ${newStatus}`);
    }
}
