const Task = require('@models/task')

module.exports = (req, res, next) => {
	const task = new Task()
	task.content = req.body.content
	task.is_done = false
	task.is_actionable = false
	task.save()
		.then(task => res.redirect(`tasks/${task.id}`))
		.catch(next)
}
