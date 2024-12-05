import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'pending'

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmedTask = newTask.trim();
    if (trimmedTask) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: uuidv4(), text: trimmedTask, isCompleted: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.isCompleted;
    if (filter === "pending") return !task.isCompleted;
    return true; // 'all'
  });

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          style={{
            backgroundColor: newTask.trim() ? "#4CAF50" : "#ccc",
          }}
        >
          Add Task
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <TaskList
        tasks={filteredTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
      />
    </div>
  );
}

const TaskList = ({ tasks, toggleTaskCompletion, deleteTask }) => (
  <ul>
    {tasks.map((task) => (
      <Task
        key={task.id}
        task={task}
        onToggle={toggleTaskCompletion}
        onDelete={deleteTask}
      />
    ))}
  </ul>
);

const Task = ({ task, onToggle, onDelete }) => (
  <li className={task.isCompleted ? "completed" : ""}>
    <span
      onClick={() => onToggle(task.id)}
      style={{ cursor: "pointer" }}
      aria-label={`Mark task ${task.text} as ${task.isCompleted ? "pending" : "completed"}`}
    >
      {task.text}
    </span>
    <button
      onClick={() => onDelete(task.id)}
      aria-label={`Delete task: ${task.text}`}
    >
      Delete
    </button>
  </li>
);

export default App;
