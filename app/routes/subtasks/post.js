const Subtask = require('@models/subtask')

module.exports = (req, res, next) => {
	const subtask = new Subtask()
	subtask.taskId = req.body.task_id
	subtask.content = req.body.content
	subtask.is_done = false
	subtask.save()
		.then(subtask => res.redirect(`tasks/${subtask.taskId}#checklist`))
		.catch(next)
}
