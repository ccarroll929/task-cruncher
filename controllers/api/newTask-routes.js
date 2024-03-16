const router = require('express').Router();
const { Task } = require('../../models');
const redis = require('redis');

// Create new task
router.post('/', async (req, res) => {
    try {
        const newTask = await Task.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        // Send the new task to Google Tasks API
        const googleTasksUrl = 'https://www.googleapis.com/tasks/v1/lists/{YOUR_TASK_LIST_ID}/tasks';
        const googleTasksPayload = {
            title: newTask.title,
            notes: newTask.description,
            status: newTask.status
        };

        await axios.post(googleTasksUrl, googleTasksPayload);

        res.status(200).json(newTask);
        res.redirect('/mainPage.js'); // redirect to mainPage.js
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
const client = redis.createClient();

// Send the new task to Google Tasks API using Redis
client.on('connect', async () => {
    const googleTasksUrl = 'https://www.googleapis.com/tasks/v1/lists/{YOUR_TASK_LIST_ID}/tasks';
    const googleTasksPayload = {
        title: newTask.title,
        notes: newTask.description,
        status: newTask.status
    };

    client.rpush('tasks', JSON.stringify(googleTasksPayload), (err, reply) => {
        if (err) {
            console.error('Error sending task to Redis:', err);
        } else {
            console.log('Task sent to Redis:', reply);
        }
    });
});

// Create new task
router.post('/', async (req, res) => {
    try {
        const newTask = await Task.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newTask);
        res.redirect('/mainPage.js'); // redirect to mainPage.js
    } catch (err) {
        res.status(400).json(err);
    }
});