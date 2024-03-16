// import models
const Task = require('./Task');
const User = require('./User');

// Products belongsTo Category
Task.belongsTo(User, {
	foreignKey: 'user_id',
	onDelete:   'CASCADE'
});

// Categories have many Products
User.hasMany(Task, {
	foreignKey: 'user_id',
	onDelete:   'CASCADE'
});
