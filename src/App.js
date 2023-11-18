// src/App.js
import React, { useState, useEffect } from 'react';
import TaskCard from './components/TaskCard';
import './styles/App.css';

const App = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the server when the component mounts
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:3000/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const addTask = () => {
    const newTask = {
      title: taskTitle,
      deadline: taskDeadline,
      completed: false,
    };
  
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response or update state as needed
        console.log('Task added:', data);
        fetchTasks(); // Fetch updated tasks after adding a new one
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };
  
  
  const completeTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
    })
      .then(() => {
        // Update the UI to mark the task as completed
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: true } : task
          )
        );
        console.log('Task completed');
      })
      .catch((error) => {
        console.error('Error completing task:', error);
      });
  };
  
  const deleteTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Wait for the deletion to complete before updating the UI
        return fetch('http://localhost:3000/tasks');
      })
      .then((response) => response.json())
      .then((data) => {
        // Update the UI with the new list of tasks
        setTasks(data);
        console.log('Task deleted');
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };
  
  
  

  const saveTasksToServer = (updatedTasks) => {
    fetch('http://localhost:3000/tasks', {
      method: 'PATCH', // Use PATCH to update existing data
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTasks),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Tasks saved to server:', data);
        setTasks(updatedTasks); // Update the state with the updated tasks
      })
      .catch((error) => console.error('Error saving tasks to server:', error));
  };

  return (
    <div className="app">
      <h1>Task Deadline Timer App</h1>
      {/* Your navigation bar here */}
      <div className="input-card">
        <h2>Enter Task Details</h2>
        <div className="label-input">
          <label>Title:</label>
          <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
        </div>
        <div className="label-input">
          <label>Deadline:</label>
          <input
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button onClick={addTask}>Add Task</button>
        </div>
      </div>
      <div className="task-cards">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            deadline={task.deadline}
            isComplete={task.isComplete}
            onDelete={deleteTask}
            onComplete={completeTask}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
