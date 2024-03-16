
// helpers.js

const bcrypt = require('bcrypt');

// User Authentication Helpers
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const checkPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Database Helpers
class DatabaseManager {
  constructor() {
    // In-memory data structure to store tasks
    this.tasks = [];
  }

  async connect() {
    // For an in-memory database, no connection setup is required.
  }

  async close() {
    // For an in-memory database, no connection closing is required.
  }

  async getTaskById(taskId) {
    return this.tasks.find(task => task._id === taskId);
  }

  async createTask(taskData) {
    const newTask = { ...taskData, _id: generateUniqueId() };
    this.tasks.push(newTask);
    return newTask;
  }

  async updateTask(taskId, updateData) {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updateData };
      return this.tasks[taskIndex];
    }
    return null;
  }

  async deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task._id === taskId);
    if (taskIndex !== -1) {
      const deletedTask = this.tasks[taskIndex];
      this.tasks.splice(taskIndex, 1);
      return deletedTask;
    }
    return null;
  }
}

// Helper function to generate a unique ID
function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

module.exports = { hashPassword, checkPassword, DatabaseManager };

// Function to format a task for display
function formatTask(task) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: formatDate(task.dueDate),
      completed: task.completed,
    };
  }
  
  // Function to validate task input
  function validateTaskInput(title, description, dueDate) {
    if (!title || !description || !dueDate) {
      throw new Error('Title, description, and due date are required');
    }
    // Additional validation logic can be added here
  }
  
  module.exports = {
    formatTask,
    validateTaskInput,
  };

