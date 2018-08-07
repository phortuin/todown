const Task = require('@models/task')
const renderer = require('@lib/renderer');

function getFilter(query) {
	return query !== undefined ? { content: { $regex: query } } : { is_done: {$ne: true} }
}

module.exports = (req, res, next) => {
	const query = req.query.q
	Task.find(getFilter(query)).sort({ is_today: 1, is_actionable: -1, is_done: -1, content: 1 }).exec()
		.then(tasks => res.send(renderer.render('views/tasks.html', { tasks, query })))
		.catch(next)
}
