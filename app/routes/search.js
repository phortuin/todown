const express = require('express');
const router = express.Router();

const Task = require('../models/task')
const renderer = require('../../lib/renderer');

function show(req, res, next) {
	if (!req.query.q) {
		res.send(renderer.render('views/search.html', {}));
	} else {
		let search = req.query.q
		if (req.query.exact) {
			search = `"${req.query.q}"`
		}
		Task.find({ $text: { $search: search }}).sort({ is_starred: -1, bumps: -1, is_done: 1, is_actionable: -1, content: 1 }).exec()
			.then(tasks => {
				res.send(renderer.render('views/search.html', { tasks, query: req.query.q }));
			}).catch(err => {
				next(err);
			})
	}
}

router.route('/')
	.get(show);

module.exports = router;
