const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const Task = require('../models/task')
const renderer = require('../../lib/renderer');

function list(req, res, next) {
	let query = {
		is_actionable: true,
		is_starred: true
	};
	if (req.query.show_all) {
		delete query.is_actionable;
	};
	Task.find(query).sort({ is_starred: -1, bumps: -1, is_done: 1, is_actionable: -1, content: 1 }).exec()
		.then(tasks => {
			res.format({
				'text/html': () => res.send(renderer.render('views/starred.html', { tasks })),
				'application/json': () => res.json({ tasks })
			})
		}).catch(err => {
			next(err);
		})
}

router.route('/')
	.get(list)

module.exports = router;
