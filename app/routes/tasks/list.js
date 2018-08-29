const Task = require('@models/task')
const renderer = require('@lib/renderer');

module.exports = (req, res, next) => {
	const query = req.query.q
	getTaskList(getFilter(query))
		.then(tasks => res.send(renderer.render('views/tasks.html', { tasks, query })))
		.catch(next)
}

// Note on sorting: `content` sometimes has a # as starting character, not represented in the task’s title, but title is virtual and cannot be sorted with
function getTaskList(filter) {
	return Task.find(filter).sort({ scheduled_date: -1, is_done: 1, is_actionable: -1, content: 1 }).exec()
}

function getFilter(query) {
	return query !== undefined ? { content: { $regex: query, $options: 'i' } } : { is_done: {$ne: true} }
}

module.exports.getTaskList = getTaskList
