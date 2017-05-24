const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const TaskSchema = new mongoose.Schema({
	content: String,
	is_done: false,
	is_actionable: false,
	is_starred: false,
	bumps: 0
});

// Regex matches anything on line one but without optional pound marks (Markdown heading notation)
// Group 2 is the match we're looking for.
//
// Note: don’t use fat arrow function, as the scope will be bound to an undefined `this`,
// whereas the get closure is bound to TaskSchema
TaskSchema.virtual('title').get(function() {
	const matches = this.content.match(/^(#{1,}\s+)?(.+)/m);
	return matches ? matches[2] : '';
});

// Export the Mongoose model
module.exports = mongoose.model('Task', TaskSchema);
