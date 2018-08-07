const Task = require('@models/task')
const moment = require('moment')

module.exports = (req, res, next) => {
	let redirectTarget
	Task.findById(req.params.id).exec()
		.then(task => {
			redirectTarget = `/tasks/${task.id}`
			if (req.body.is_done) {
				task.setDone()
			}
			if (req.body._action === 'done' && !req.body.is_done) {
				task.is_done = false
			}
			if (req.body.is_actionable) {
				task.is_actionable = true
			}
			if (req.body._action === 'actionable' && !req.body.is_actionable) {
				task.is_actionable = false
			}
			if (req.body.scheduled_date) {
				switch (req.body.scheduled_date) {
					case 'today':
						task.setToday()
						redirectTarget = '/today'
						break
					case 'tomorrow':
						task.setTomorrow()
						break
					default:
						task.scheduled_date = null
						break
				}
			}
			if (req.body.content) {
				task.content = req.body.content
			}
			if (req.body._action === 'clear_date') {
				task.scheduled_date = null
			}
			return task.save()
		}).then(task => res.redirect(redirectTarget))
		.catch(next)
}
