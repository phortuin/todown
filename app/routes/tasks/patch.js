const Task = require('@models/task')
const moment = require('moment')

module.exports = (req, res, next) => {
	let redirectTarget
	Task.findById(req.params.id).exec()
		.then(task => {
			redirectTarget = `/tasks/${task.id}`
			if (req.body.is_done) {
				task.is_done = true
			}
			if (req.body._action === 'done' && !req.body.is_done) {
				task.is_done = false
			}
			if (req.body.scheduled_date) {
				switch (req.body.scheduled_date) {
					case 'today':
						task.scheduled_date = moment().startOf('day');
						redirectTarget = '/today'
						break;
					case 'tomorrow':
						task.scheduled_date = moment().add(1, 'd').startOf('day');
						break;
					default:
						task.scheduled_date = null;
						break;
				}
			}
			return task.save()
		}).then(task => res.redirect(redirectTarget))
		.catch(next)
}
