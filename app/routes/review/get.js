const Task = require('@models/task')
const renderer = require('@lib/renderer')
const moment = require('moment')

module.exports = (req, res, next) => {
	Task.find({
		is_done: { $ne: true },
		is_actionable: true,
		$or: [
			{ scheduled_date: null },
			{ scheduled_date: { $lt: moment().startOf('day') } },
		]
	}).sort({ content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/review.html', { tasks })))
		.catch(next)
}
