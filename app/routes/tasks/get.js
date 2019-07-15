const Task = require('@models/task')
const renderer = require('@lib/renderer');

module.exports = (req, res, next) => {
	Task.findById(req.params.id).populate('subtasks').exec()
		.then(task => res.send(renderer.render('views/task.html', { task })))
		.catch(next)
}
