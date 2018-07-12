const Promise = require('bluebird');
const moment = require('moment');

const Task = require('@models/task')
const Page = require('@models/page')
const renderer = require('@lib/renderer');

module.exports = function get(req, res, next) {
	let query = {
		is_actionable: true,
		is_done: {$ne: true},
		scheduled_date: moment().startOf('day')
	};
	if (req.query.show_all) {
		delete query.is_actionable;
		delete query.scheduled_date;
	}
	Promise.all([
		Task.find({ is_quick: true, is_done: false }).exec(),
		Task.find(query).sort({ is_starred: -1, bumps: -1, is_done: 1, is_actionable: -1, content: 1 }).exec(),
		Page.find({ is_sticky: true }).sort({ title: 1 }).exec(),
	]).spread(( quickies, tasks, pages ) => {
			const quick = quickies[Math.floor(Math.random() * quickies.length)];
			res.format({
				'text/html': () => res.send(renderer.render('views/today.html', { quick, tasks, pages })),
				'application/json': () => res.json({ tasks })
			})
		}).catch(err => {
			next(err);
		})
}
