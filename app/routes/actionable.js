const express = require('express');
const router = express.Router();

const Task = require('../models/task')
const renderer = require('../../lib/renderer');

function show(req, res, next) {
	Task.find({ is_done: {$ne: true}, is_actionable: {$ne: true}}).exec()
		.then(tasks => {
			res.send(renderer.render('views/actionable.html', { tasks }));
		}).catch(err => {
			next(err);
		})
}

function save(req, res, next) {
	// misschien wel erg duur om door alle records te gaan? beter vanuit de req.body te kijken?
	// aan de andere kant, dan moet je per task een query doen
	Task.find({ is_done: {$ne: true}, is_actionable: {$ne: true}}).exec()
		.map(task => {
			const taskContent = req.body[`${task.id}__content`]; // would only exist if task we're iterating over had a content field in the posted form
			if (taskContent !== undefined && taskContent !== task.content) {
				if (taskContent !== '') { // empty string? delete it
					task.content = taskContent;
					task.is_actionable = true;
					return task.save();
				} else {
					return task.remove();
				}
			} else {
				return task;
			}
		}).then(() => {
			res.redirect('/actionable');
		}).catch(err => {
			next(err);
		})
}

router.route('/')
	.get(show)
	.post(save);

module.exports = router;
