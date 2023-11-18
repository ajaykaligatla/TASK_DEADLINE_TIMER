// src/components/TaskCard.js
import React, { useState, useEffect } from 'react';
import '../styles/TaskCard.css';

const TaskCard = ({ id, title, deadline, isComplete, onDelete, onComplete }) => {
  const calculateTimeRemaining = () => {
    const now = new Date();
    const targetDate = new Date(deadline);

    const timeDiff = targetDate - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return days;
  };

  const [daysRemaining, setDaysRemaining] = useState(calculateTimeRemaining);
  const [completed, setCompleted] = useState(isComplete);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDaysRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [deadline]);

  useEffect(() => {
    // Fetch the completed state from the server when the component mounts
    fetch(`http://localhost:3000/tasks/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCompleted(data.completed);
      })
      .catch((error) => console.error('Error fetching task:', error));
  }, [id]);

  const handleComplete = () => {
    setCompleted(true);
    onComplete(id);

    // Save the completed state to the server
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response or update state as needed
        console.log('Task completed:', data);
      })
      .catch((error) => {
        console.error('Error completing task:', error);
      });
  };

  return (
    <div className={`task-card ${daysRemaining < 0 ? 'deadline-crossed' : ''} ${completed ? 'completed' : ''}`}>
      <h2>{title}</h2>
      <p>
        Deadline: {deadline} ({daysRemaining} days remaining)
      </p>
      <div className="button-container">
        <button onClick={() => onDelete(id)}>Delete</button>
        {!completed && (
          <button onClick={handleComplete} className="complete-button">
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
