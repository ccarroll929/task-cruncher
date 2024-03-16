// Required libraries
const {Model, DataTypes} = require('sequelize');
const bcrypt             = require('bcrypt');
const sequelize          = require('../config/connection');

const passwordMinLen = 8;
const saltRounds     = 10;

// User model for users
class User extends Model {
	/**
	 * Hashes a user password.
	 *
	 * @async
	 * @param {string} password - The plaintext password.
	 * @returns {Promise<string>} Hashed password.
	 */
	static async hashPassword(password) {
		return await bcrypt.hash(password, saltRounds);
	}

	/**
	 * Check the entered password against the hash in the database.
	 *
	 * @param {string} password - The plaintext password.
	 * @returns {boolean} The result of comparing the hashed and plaintext passwords.
	 */
	checkPassword(password) {
		return bcrypt.compareSync(password, this.password);
	}
}

// Run the init function
User.init({
	          // ID
	          id: {
		          type:          DataTypes.INTEGER,
		          allowNull:     false,
		          primaryKey:    true,
		          autoIncrement: true
	          },
	          // First Name
	          first_name: {
		          type:      DataTypes.STRING,
		          allowNull: false,
		          validate:  {
			          isAlpha: true
		          }
	          },
	          // Last Name
	          last_name: {
		          type:      DataTypes.STRING,
		          allowNull: false,
		          validate:  {
			          isAlpha: true
		          }
	          },
	          // Email
	          email: {
		          type:      DataTypes.STRING,
		          allowNull: false,
		          unique:    true,
		          validate:  {
			          isEmail: true
		          }
	          },
	          // Password
	          password: {
		          type:      DataTypes.STRING,
		          allowNull: false,
		          validate:  {
			          len: [passwordMinLen]
		          }
	          }
          },
          // Extra parameters
          {
	          // Hooks
	          hooks:           {
		          // Before creating the entry, make sure that the user's password is encrypted
		          beforeCreate: async (userData) => {
			          // Hash user password
			          userData.password = await User.hashPassword(userData.password);
			          return userData;
		          },
		          // Before updating, make sure the user's password is encrypted.
		          beforeUpdate: async (userData) => {
			          // Hash user password
			          userData.password = await User.hashPassword(userData.password);
			          return userData;
		          }
	          },
	          sequelize,
	          timestamps:      false,
	          freezeTableName: true,
	          underscored:     true,
	          modelName:       'user'
          });
// Export module
module.exports = User;
