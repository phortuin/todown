const moment = require('moment');
const Task = require('@models/task')
const renderer = require('@lib/renderer');

module.exports = function get(req, res, next) {
	Task.find({ scheduled_date: moment().startOf('day') }).populate('subtasks').sort({ content: 1 }).exec()
		.then(tasks => {
			res.format({
				'application/json': () => res.send(tasks),
				'text/html': () => res.send(renderer.render('views/today.html', { tasks }))
			})
		})
		.catch(next)
}
