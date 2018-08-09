const Task = require('@models/task')
const moment = require('moment')

module.exports = (req, res, next) => {
	Task.find().exec()
		.map(task => {
			if (req.body[`${task.id}__task`] === 'on') {
				switch (req.body._action) {
					case 'done':
						task.setDone()
						break
					case 'clear_date':
						task.scheduled_date = null
						break
					case 'today':
						task.setToday()
						break
					case 'tomorrow':
						task.setTomorrow()
						break
				}
			}
			return task.save()
		})
		.then(() => res.redirect(req.query.redirect || '/'))
		.catch(next)
}
