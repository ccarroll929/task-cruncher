// Load required modules
require('dotenv').config();
const Sequelize = require('sequelize');

// Pull DB information from environmental variables.
const {
          // Load database name, password and user from .env
          DB_NAME,
          DB_PASSWORD,
          DB_USER,
          // Assign defaults
          DB_DIALECT = 'mysql',     // Use MySQL (MariaDB is better)
          DB_PORT    = 3306,        // MySQL standard port is: 3306
          DB_SERVER  = 'localhost'  // Connect to the localhost DB
      } = process.env;

// Create a connection and save the handler
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,
                                {
                                    dialect: DB_DIALECT,
                                    host:    DB_SERVER,
                                    port:    DB_PORT,
                                    logging: console.log
                                }
);

// Export the module
module.exports = sequelize;
