const moment = require('moment')
const Task = require('@models/task')
const renderer = require('@lib/renderer')

module.exports = function get(req, res, next) {
	Task.find({ is_actionable: false, is_done: false }).populate('subtasks').sort({ content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/inbox.html', { tasks })))
		.catch(next)
}
