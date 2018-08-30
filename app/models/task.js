const mongoose = require('mongoose');
const moment = require('moment')
const { getTitleFromMarkdown, getScheduledHumanReadable, getIsToday } = require('../helpers')
mongoose.Promise = require('bluebird');

const TaskSchema = new mongoose.Schema({
	content: String,
	is_done: false,
	is_actionable: false,
	is_starred: false,
	is_quick: false,
	scheduled_date: Date,
	bumps: 0
});

// Add a text index on content, so we can search it
// Source: https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
TaskSchema.index({ content: 'text' });
TaskSchema.virtual('title').get(getTitleFromMarkdown);
TaskSchema.virtual('scheduled_hr').get(getScheduledHumanReadable);
TaskSchema.virtual('page', { // task lives on which page?
	ref: 'Page',
	localField: '_id',
	foreignField: 'tasks',
	justOne: true // make sure it returns a single object, not an array
});
TaskSchema.virtual('is_today').get(getIsToday)

TaskSchema.methods.setDone = function() {
	this.is_done = true
	this.is_actionable = true
	this.scheduled_date = null
}

TaskSchema.methods.setToday = function() {
	this.scheduled_date = moment().startOf('day')
	this.is_done = false
	this.is_actionable = true
}

TaskSchema.methods.setTomorrow = function() {
	this.scheduled_date = moment().add(1, 'd').startOf('day')
	this.is_done = false
	this.is_actionable = true
}

module.exports = mongoose.model('Task', TaskSchema);
