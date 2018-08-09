const Task = require('@models/task')
const renderer = require('@lib/renderer')
const moment = require('moment')

module.exports = function get(req, res, next) {
	Task.find({ scheduled_date: moment().add(1, 'd').startOf('day') }).sort({ content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/tomorrow.html', { tasks })))
		.catch(next)
}
