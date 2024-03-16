const {google} = require('googleapis');
// Object being passed can be found here: https://developers.google.com/tasks/reference/rest/v1/tasks#Task

/**
 * GoogleTasksService handles operations with the Google Tasks API.
 */
class GoogleTasksService {
	cache;
	client;

	/**
	 * Constructor for GoogleTasksService.
	 * Authenticates with Google Tasks API and creates an API client.
	 */
	constructor(redis) {
		// Save the Redis connection.
		this.cache = redis;
		const auth = new google.auth.GoogleAuth({
			                                        keyFile: './supersecretkey.json',
			                                        scopes:  [
				                                        'https://www.googleapis.com/auth/tasks',
				                                        'https://www.googleapis.com/auth/tasks.readonly'
			                                        ]
		                                        });
		// this.client points to the Google Tasks API client.
		this.client = google.tasks({version: 'v1', auth: auth});
	}

	/**
	 * Mark a task as completed in Google Tasks
	 *
	 * @param {string} taskListId - The ID of the task list containing the task.
	 * @param {string} taskId - The ID of the task to mark as completed.
	 * @throws Will throw an error if the request fails.
	 * @return {object} - The updated task data.
	 */
	async completeTask(taskListId, taskId) {
		try {
			const response = await this.client.tasks.update({
				                                               tasklist: taskListId,
				                                               task: taskId,
				                                               resource: { status: 'completed', 'completed': new Date().toISOString() }
			                                               });
			return response.data;
		} catch (error) {
			console.error('GoogleTasksService:completeTask - Error:', error);
			throw error;
		}
	}
	/**
	 * Create a task on Google Tasks.
	 *
	 * @param {string} taskListId - The ID of the task list to add the task to.
	 * @param {object} task - The task object to be created. Must comply with Google Tasks API.
	 * @throws Will throw an error if the request fails.
	 * @return {object} - The created task data.
	 */
	async createTask(taskListId, task) {
		try {
			const response = await this.client.tasks.insert({
				                                               tasklist: taskListId,
				                                               resource: task
			                                               });
			return response.data;
		} catch (error) {
			console.error('GoogleTasksService:createTask - Error:', error);
			throw error;
		}
	}

	/**
	 * Delete a task on Google Tasks.
	 *
	 * @param {string} taskListId - The ID of the task list the task belongs to.
	 * @param {string} taskId - The ID of the task to be deleted.
	 * @throws Will throw an error if the request fails.
	 */
	async deleteTask(taskListId, taskId) {
		try {
			await this.client.tasks.delete({
				                              tasklist: taskListId,
				                              task:     taskId
			                              });
		} catch (error) {
			console.error('GoogleTasksService:deleteTask - Error:', error);
			throw error;
		}
	}

	/**
	 * Get a specific task from a task list in Google Tasks.
	 *
	 * @param {string} taskListId - The ID of the task list containing the task.
	 * @param {string} taskId - The ID of the task to retrieve.
	 * @throws Will throw an error if the request fails.
	 * @return {object} - The task data.
	 */
	async getTask(taskListId, taskId) {
		try {
			const response = await this.client.tasks.get({
				                                            tasklist: taskListId,
				                                            task: taskId
			                                            });
			return response.data;
		} catch (error) {
			console.error('GoogleTasksService:getTask - Error:', error);
			throw error;
		}
	}

	/**
	 * Retrieve all tasks from a Google Tasks list.
	 *
	 * @param {string} taskListId - The ID of the task list the tasks belong to.
	 * @throws Will throw an error if the request fails.
	 * @return {Array} - Array of task items from the specified task list.
	 */
	async listTasks(taskListId) {
		try {
			const response = await this.client.tasks.list({
				                                             tasklist: taskListId
			                                             });
			return response.data.items;
		} catch (error) {
			console.error('GoogleTasksService:getTasks - Error:', error);
			throw error;
		}
	}

	/**
	 * Update an existing task in Google Tasks.
	 *
	 * @param {string} taskListId - The ID of the task list containing the task to be updated.
	 * @param {string} taskId - The ID of the task to be updated.
	 * @param {object} task - The updated task object, which must comply with the Google Tasks API.
	 *               This could contain properties like {'title', 'notes', 'due', 'completed'} to be updated for the task.
	 * @throws Will throw an error if the request fails.
	 * @return {object} - The updated task data.
	 */
	async updateTask(taskListId, taskId, task) {
		try {
			const response = await this.client.tasks.update({
				                                               tasklist: taskListId,
				                                               task: taskId,
				                                               resource: task
			                                               });
			return response.data;
		} catch (error) {
			console.error('GoogleTasksService:updateTask - Error:', error);
			throw error;
		}
	}
}

// Export module
module.exports = GoogleTasksService;
