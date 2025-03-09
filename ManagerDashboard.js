import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [employees, setEmployees] = useState([]); // State to store employees
  const [selectedEmployee, setSelectedEmployee] = useState(''); // State for selected employee
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch tasks and employee list when the component loads
  useEffect(() => {
    const fetchTasksAndEmployees = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch tasks
        const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasksResponse.data);

        // Fetch employees
        const employeesResponse = await axios.get('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employeesResponse.data); // Store employee list in state
      } catch (error) {
        console.error('Error fetching tasks or employees:', error);
        setErrorMessage('Failed to load data.');
      }
    };

    fetchTasksAndEmployees();
  }, []);

  // Handle form input change for task title and description
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Handle employee selection change
  const handleEmployeeSelect = (e) => {
    setSelectedEmployee(e.target.value); // Set the selected employee's ID
  };

  // Handle task creation
  const handleAddTask = async () => {
    const token = localStorage.getItem('token');

    // Ensure task fields and employee selection are filled
    if (!newTask.title || !newTask.description || !selectedEmployee) {
      setErrorMessage('Please fill out all fields and select an employee.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { ...newTask, assignedTo: selectedEmployee }, // Use the selected employee's ID
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks([...tasks, response.data]); // Add the new task to the task list
      setNewTask({ title: '', description: '' }); // Clear the form
      setSelectedEmployee(''); // Clear the selected employee
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      console.error('Error adding task:', error);
      setErrorMessage('Failed to add task. Please try again.');
    }
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>

      {/* Task creation section */}
      <div>
        <h3>Create New Task</h3>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleChange}
        />

        {/* Employee selection dropdown */}
        <select value={selectedEmployee} onChange={handleEmployeeSelect}>
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>

        <button onClick={handleAddTask}>Add Task</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error */}
      </div>

      {/* Task list section */}
      <div>
        <h3>Assigned Tasks</h3>
        {tasks.length > 0 ? (
          tasks.map((task) => <Task key={task._id} task={task} />)
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
