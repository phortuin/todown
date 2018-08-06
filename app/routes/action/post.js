const Task = require('@models/task')

module.exports = (req, res, next) => {
	Task.find({ is_done: {$ne: true}, is_actionable: {$ne: true} }).exec()
		.map(task => {
			const taskContent = req.body[`${task.id}-content`]
			if (req.body[`${task.id}-delete`] === 'on') {
				return task.remove()
			}
			if (taskContent !== undefined && taskContent !== task.content) {
				if (taskContent === '') {
					return task.remove()
				}
				task.content = taskContent
				task.is_actionable = true
				return task.save()
			}
			return task
		})
		.then(() => res.redirect(req.query.redirect || '/'))
		.catch(next)
}
