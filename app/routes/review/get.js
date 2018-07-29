const Task = require('@models/task')
const renderer = require('@lib/renderer');

module.exports = (req, res, next) => {
	Task.find({ is_done: {$ne: true} }).sort({ content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/review.html', { tasks })))
		.catch(next)
}
