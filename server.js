// Built-in Modules
const path = require('path');

// External modules
require('dotenv').config();
const express = require('express');
const routes  = require('./controllers');
const session = require('express-session');

// Directory definitions
const dirs = {
	data:   path.join(__dirname, 'data'),
	public: path.join(__dirname, 'public'),
	views:  path.join(__dirname, 'views')
};

// Set up handlebars
const handlebars = require('express-handlebars');
const hbs        = handlebars.create({});

// Set up the application port
const PORT = process.env.PORT || 3000;

const redis  = require('redis');
const GTasks = require('./services/GoogleTasksService');

// Database and session management
const sequelize      = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// Set up sessions with cookies
const sess           = {
	secret:            process.env.SESSION_SECRET,
	cookie:            {
		httpOnly: true,
		maxAge:   24 * 60 * 60 * 1000, // 1 Day
		sameSite: 'strict',
		secure:   false
	},
	resave:            false,
	saveUninitialized: true,
	store:             new SequelizeStore({db: sequelize})
};

// Instantiate and configure Express
const app = express();
app.engine('handlebars', hbs.engine)
	// Set the views and data directories
   .set('view engine', 'handlebars')
   .set('views', dirs.views)
   .set('data', dirs.data)
   .get('/', (req, res) => {
	res.render('mainPage')
})
	// Use sessions, parse JSON, serve static files and include routes.
   .use(session(sess))
   .use(express.json())
   .use(express.urlencoded({extended: true}))
   .use(express.static(dirs.public))
   .use(routes);

// Synchronize the session store
sess.store.sync();

// Start the server
const server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// Handle exiting gracefully for various exit signals.
// On uncaught exceptions, exit with a failure code.
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('uncaughtException', (err) => {
	console.error('Uncaught exception', err);
	handleExit();
});

/**
 * Function to handle the server exit gracefully.
 */
function handleExit() {
	server.close(() => {
		console.log('\nServer closed');
		process.exit();
	});
}
