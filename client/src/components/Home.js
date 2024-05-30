import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: token }
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error(error);
    }
  };
  
  const addTask = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', { task: newTask }, {
        headers: { Authorization: token }
      });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (index) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/tasks/${tasks[index]._id}`, { task: editedTask }, {
        headers: { Authorization: token }
      });
      setEditingIndex(-1);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (index) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${tasks[index]._id}`, {
        headers: { Authorization: token }
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (index, task) => {
    setEditingIndex(index);
    setEditedTask(task);
  };

  const logout = () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      // Redirect user to login page
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };
  
  

  return (
    <div className="text-2l max-w-md mx-auto mt-8">
      <h1 className="text-5xl text-center mb-4 font-semibold text-blue-900">To Do List</h1>
      <div className="text-2l max-w-md mx-auto mt-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="flex-grow px-8 py-2 mb-4 mr-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={addTask}
          className="px-2 py-2 mb-4 text-white bg-green-800 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Add Task
        </button>
        {tasks.map((task, index) => (
          <div key={index} className="task-container bg-red-200 rounded-md p-4 mb-2 flex items-center justify-between">
            {editingIndex === index ? (
              <input
                type="text"
                value={editedTask}
                onChange={(e) => setEditedTask(e.target.value)}
                className="flex-grow px-3 py-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            ) : (
              <div className="flex-grow px-3 py-2 mr-2">{task.task}</div>
            )}
            <div>
              {editingIndex === index ? (
                <button
                  onClick={() => updateTask(index)}
                  className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none mr-2"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEditing(index, task.task)}
                  className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none mr-2"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteTask(index)}
                className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <button onClick={logout}
                className="px-5 py-2 text-white bg-green-500 rounded-md hover:bg-red-600 focus:outline-none mt-4"
         >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
