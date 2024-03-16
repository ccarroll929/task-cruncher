// Import Routes
const router = require('express').Router();
const apiRoutes = require('./api/index');
const mainRoutes = require('./mainPage.js');

//Setup middleware
router.use('/api', apiRoutes);
router.use('/', mainRoutes);

// Export Routes
module.exports = router;