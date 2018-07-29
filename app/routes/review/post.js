const Task = require('@models/task')
const moment = require('moment')

module.exports = (req, res, next) => {
	let redirectTarget = '/'
	Task.find({ is_done: {$ne: true} }).exec()
		.map(task => {
			if (req.body[`${task.id}-done`] === 'on') {
				task.is_done = true
				task.save()
			}
			if (req.body[`${task.id}-delete`] === 'on') {
				task.remove()
			}
			if (req.body[`${task.id}-today`] === 'on') {
				task.scheduled_date = moment().startOf('day')
				redirectTarget = '/today'
				task.save()
			}
			return task
		})
		.then(() => res.redirect(redirectTarget))
		.catch(next)
}