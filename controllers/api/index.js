// Initiate express router
const router = require('express').Router();

// Import required modules
const mainPage = require('./mainPage-routes.js');
const editTask = require('./editTask-routes.js'); 
const homepage = require('./homePage-routes.js'); 
const login    = require('./login-routes.js'); 
const newTask  = require('./newTask-routes.js'); 
const signup   = require('./signup-routes.js'); 

// Setup routes
router.use('/', mainPage);
router.use('/editTask', editTask);
router.use('/homepage', homepage);
router.use('/login', login);
router.use('/newTask', newTask);
router.use('/signup', signup);

// Export the router
module.exports = router;