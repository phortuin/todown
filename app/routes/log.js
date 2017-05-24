const express = require('express');
const router = express.Router();

const Task = require('../models/task')
const renderer = require('../../lib/renderer');

function all(req, res, next) {
	Task.find({ is_done: true }).sort({ is_starred: -1, bumps: -1, is_done: 1, is_actionable: -1, content: 1 }).exec()
		.then(tasks => {
			res.send(renderer.render('views/log.html', { tasks }))
		});
}

router.route('/')
	.get(all);

module.exports = router;
