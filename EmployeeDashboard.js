import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(''); // State for success messages

  // Fetch tasks from the server on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks. Please try again later.');
      }
    };
    fetchTasks();
  }, []);

  // Handle task confirmation
  const handleConfirmTask = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/tasks/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the tasks state with the confirmed task
      const updatedTasks = tasks.map((task) => (task._id === id ? response.data : task));
      setTasks(updatedTasks);
      setError(''); // Clear any errors on success
      setSuccess('Task confirmed successfully!'); // Display success message
    } catch (err) {
      console.error('Error confirming task:', err);
      setError('Failed to confirm the task. Please try again.');
      setSuccess(''); // Clear success message on error
    }
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>

      {/* Display error or success messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Task key={task._id} task={task} onConfirm={() => handleConfirmTask(task._id)} />
          ))
        ) : (
          <p>No tasks assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
