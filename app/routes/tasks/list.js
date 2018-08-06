const Task = require('@models/task')
const renderer = require('@lib/renderer');

module.exports = (req, res, next) => {
	Task.find({ is_done: {$ne: true} }).sort({ is_actionable: -1, content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/tasks.html', { tasks })))
		.catch(next)
}
