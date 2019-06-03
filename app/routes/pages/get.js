const Page = require('@models/page')
const Promise = require('bluebird');
const renderer = require('@lib/renderer');
const getTaskList = require('@routes/tasks/list').getTaskList

function getTaggedTasks(page) {
	if (page.tags) {
		return getTaskList({ $text: { $search: page.tags }, is_done: { $ne: true }})
			.then(tasks => ({ page, tasks }))
	} else {
		return Promise.resolve({ page, tasks: [] })
	}
}

module.exports = (req, res, next) => {
	Page.findById(req.params.id).exec()
		.then(getTaggedTasks)
		.then(pagesAndTasks => res.send(renderer.render('views/page.html', pagesAndTasks)))
		.catch(next)
}
