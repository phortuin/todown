const express = require('express');
const router = express.Router();

const Task = require('../models/task')
const renderer = require('../../lib/renderer');

function show(req, res, next) {
	Task.find({ is_done: {$ne: true}}).exec()
		.then(tasks => {
			res.send(renderer.render('views/review.html', { tasks }));
		}).catch(err => {
			next(err);
		});
}

function save(req, res, next) {
	// misschien wel erg duur om door alle records te gaan? beter vanuit de req.body te kijken?
	// aan de andere kant, dan moet je per task een query doen
	Task.find({ is_done: {$ne: true}}).exec()
		.map(task => {
			if (req.body[`${task.id}__is_done`] === 'on') {
				task.is_done = true;
				task.is_actionable = true;
				task.is_starred = false;
				task.save();
			}
			if (req.body[`${task.id}__is_deleted`] === 'on') {
				task.remove();
			}
			if (req.body[`${task.id}__is_starred`] === 'on') {
				task.is_starred = true;
				task.is_actionable = true;
				task.save();
			}
			if (req.body[`${task.id}__bump`] === 'on') {
				task.bumps += 1;
				task.save();
			}
			return task;
		}).then(() => res.redirect('/review'))
		.catch(err => next(err));
}

router.route('/')
	.get(show)
	.post(save);

module.exports = router;
