const Task = require('@models/task')

module.exports = (req, res, next) => {
	Task.findByIdAndRemove(req.params.id).exec()
		.then(() => res.redirect(req.query.redirect || '/'))
		.catch(next)
}
