const Task = require('@models/task')
const renderer = require('@lib/renderer');

module.exports = function get(req, res, next) {
	Task.find().sort({ content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/tasks.html', { tasks })))
		.catch(next)
}
