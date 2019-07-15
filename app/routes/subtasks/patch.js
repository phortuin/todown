const Subtask = require('@models/subtask')

module.exports = (req, res, next) => {
	Subtask.findById(req.params.id).exec()
		.then(subtask => {
			subtask.is_done = req.body.is_done === 'on' ? true : false;
			return subtask.save()
		}).then(subtask => res.redirect(`/tasks/${subtask.taskId}#checklist`))
		.catch(next)
}
