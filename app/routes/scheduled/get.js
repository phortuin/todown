const moment = require('moment')
const Task = require('@models/task')
const renderer = require('@lib/renderer')

module.exports = function get(req, res, next) {
	Task.find({ scheduled_date: {$ne: null}, is_done: false }).populate('subtasks').sort({ content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/scheduled.html', { tasks })))
		.catch(next)
}
