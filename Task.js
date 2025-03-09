import React from 'react';
import './Task.css';


const Task = ({ task, onConfirm }) => {
  return (
    <div className="task">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      {task.confirmed ? (
        <p>Status: Confirmed</p>
      ) : (
        <button onClick={() => onConfirm(task.id)}>Confirm Task</button>
      )}
    </div>
  );
};

export default Task;
