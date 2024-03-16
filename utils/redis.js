require('dotenv').config();
const util = require('util');

const redis   = require('redis');
const {query} = require('express');

/**
 * @class RedisCache
 * @classdesc Establishes a connection with the Redis server.
 */
class RedisCache {
	db = undefined;

	/***
	 * @constructor
	 * @description Connects to Redis server during object instantiation
	 */
	constructor() {
		const connectionData = {
			host: process.env.REDIS_SERVER,
			port: process.env.REDIS_PORT
		};

		// If a user and password are used, use both, otherwise use
		// password. If there is no password cache will ignore it.
		if (process.env.REDIS_PASS.length) {
			connectionData.password = (process.env.REDIS_USER) ? `${process.env.REDIS_USER}:${process.env.REDIS_PASS}`
			                                                   : process.env.REDIS_PASS;
		}

		this.connect(connectionData);
	}

	/***
	 * Establishes a connection with the Redis server.
	 *
	 * @method
	 * @name connect
	 * @memberof RedisCache
	 * @description Connects to Redis server, and handles connection events.
	 * @param {Object} connectionData - The connection details for the Redis server.
	 * @param {string} connectionData.host - The host address of the Redis server.
	 * @param {string|number} connectionData.port - The port number of the Redis server.
	 * @param {string} connectionData.password - The password for the Redis server. If a username and password are
	 *     used, both should be provided. If there is no password, Redis will ignore it.
	 * @returns {void}
	 */
	async connect(connectionData) {
		// Create a connection to Redis.
		const db = await redis.createClient()
		                      .on('error', err => {
			                      // Log the error if there is one
			                      console.error('Redis error: ', err);
		                      })
		                      .on('connect', () => {
			                      // Note that cache was connected successfully.
			                      console.log(`Redis connected successfully to ${process.env.REDIS_SERVER}:${process.env.REDIS_PORT}`);
			                      this.db = db;
		                      });
		// Connect
		await db.connect();
	}

	/**
	 * Attempts to disconnect from the Redis server if there is an active connection.
	 * Logs a message indicating either a successful disconnection or an error message.
	 * @memberof RedisCache
	 * @returns {void}
	 */
	disconnect() {
		// If there was a connection to Redis, disconnect.
		if (this.db) this.db.quit((err, res) => {
			console.log('Attempting to disconnect from Redis');
			if (err) console.error('Redis error: ', err);
			else console.log('Redis disconnected');
		});
	}

	/**
	 * Asynchronous function that retrieves a value for a given key from the Redis database.
	 * If there is no active database connection, it returns 'null'.
	 *
	 * @param {string} key The key for which the value will be retrieved.
	 * @return {Promise<*>} The value associated to the given key or null if there's no database connection.
	 * @throws {Error} If the key doesn't exist in the database or if there's any other database related error.
	 */
	async get(key) {
		// If there is no database connection, don't do anything.
		if (!this.db) return null;

		// Returns the key
		return await this.db.get(key);
	}

	/**
	 * Asynchronous function that performs a scan in the Redis database given a query object.
	 * The query object is modified to include default values for 'cursor', 'MATCH' and 'COUNT' if they are not provided.
	 * If there is no active database connection, it returns 'null'.
	 *
	 * @param {Object} queryObj The query object to be used for scanning the Redis database.
	 *                  It has a property 'cursor' which indicates where to start the scan and 'MATCH' and 'COUNT' properties which affect the scan operation.
	 * @return {Promise<Array>} Set of keys resulting from the scan operation or null if there's no database connection.
	 * @throws {Error} If there's any database related error during the scan operation.
	 */
	async scan(queryObj) {
		// If there is no database connection, don't do anything.
		if (!this.db) return null;

		queryObj = {
			cursor: 0,
			MATCH:  '*',
			COUNT:  10,
			...queryObj
		};

		// Make sure that the returned keys are unique.
		let keys = new Set();

		do {
			// Scan the database for matching keys
			const result = await this.db.scan(queryObj.cursor, queryObj);
			// For each key that's found, add them to the key set.
			result.keys.forEach(key => keys.add(key));
			// Set the cursor to the resulting cursor and loop until it's 0 again.
			queryObj.cursor = result.cursor;
		} while (queryObj.cursor !== 0);

		// Return the key set as an array.
		return [...keys];
	}

	/**
	 * Sets a key-value pair with optional expiration in Redis.
	 *
	 * This function checks if there is a database connection. If not, it stops there and returns null.
	 * If there is a database connection, it proceeds to check if an expiration time was set for the key.
	 * If an expiration time was set, it adds the expiration type (converted to 'EX' if expireType is not set) and the time to the query object.
	 * Finally, the function sets the key and value in the database and returns the result of the operation.
	 *
	 * @async
	 * @function set
	 * @memberOf RedisCache
	 * @param {Object} setObj - An object containing the data to be set in RedisCache
	 * @param {string} setObj.key - The key
	 * @param {string} setObj.value - The value
	 * @param {string} [setObj.expireType='EX'] - The expiration type. If not specified, defaults to 'EX'
	 * @param {number} [setObj.expire] - The amount of time (in seconds) after which the key should expire
	 * @returns {Promise<number | string>} The result of the set operation
	 */
	async set(setObj) {
		// If there is no database connection, don't do anything.
		if (!this.db) return null;

		const queryObj = {};
		// If an expiration is specified, set the expiration type, and the time.
		if (setObj.expire)
			queryObj[setObj?.expireType ?? 'EX'] = setObj.expire;

		// Set the key
		return await this.db.set(setObj.key, setObj.value, queryObj);
	}
}

module.exports = RedisCache;