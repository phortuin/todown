const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const Schema = mongoose.Schema

const SubtaskSchema = new mongoose.Schema({
	taskId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	content: String,
	is_done: false,
})

SubtaskSchema.methods.setDone = function() {
	this.is_done = true
}

module.exports = mongoose.model('Subtask', SubtaskSchema)
