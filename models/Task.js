const {Model, DataTypes} = require('sequelize');
const sequelize          = require('../config/connection');

// Task model for blog posts
class Task extends Model {}

Task.init(
	{
		// Task ID
		id:      {
			type:          DataTypes.INTEGER,
			allowNull:     false,
			primaryKey:    true,
			autoIncrement: true
		},
		// Task Date
		date:    {
			type:         DataTypes.DATE,
			allowNull:    false,
			defaultValue: DataTypes.NOW
		},
		// Task Title
		title:   {
			type:      DataTypes.STRING,
			allowNull: false
		},
		// Task Body
		body:    {
			type:      DataTypes.TEXT,
			allowNull: false
		},
		// User
		user_id: {
			type:       DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'user',
				key:   'id'
			}
		}
	},
	{
		sequelize,
		timestamps:      false,
		freezeTableName: true,
		underscored:     true,
		modelName:       'Task'
	}
);
// Export module
module.exports = Task;
