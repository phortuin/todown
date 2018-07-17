const Task = require('@models/task')
const renderer = require('@lib/renderer');

module.exports = function get(req, res, next) {
	Task.findById(req.params.id).exec()
		.then(task => res.send(renderer.render('views/task.html', { task })))
		.catch(next)
}
