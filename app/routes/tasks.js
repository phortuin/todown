const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const Task = require('../models/task')
const renderer = require('../../lib/renderer');

function show(req, res, next) {
	Task.findById(req.params.id).exec()
		.then(task => {
			res.send(renderer.render('views/task.html', { task }));
		}).catch(err => {
			next(err);
		})
}

function edit(req, res, next) {
	Task.findById(req.params.id).exec()
		.then(task => {
			res.send(renderer.render('views/task-edit.html', { task }))
		}).catch(next)
}

function update(req, res, next) {
	switch(req.body._method) {
		case "PUT":
			Task.findById(req.params.id).exec().then(task => {
				if (req.body.content) {
					task.content = req.body.content;
					// actionable is part of form that submits content
					task.is_actionable = !!req.body.is_actionable;
				}
				if (req.body.is_done) {
					const is_done = req.body.is_done === "true" || false;
					task.is_done = is_done;
					if (is_done) {
						task.is_actionable = true;
						task.is_starred = false;
					}
				}
				if (req.body.is_starred) {
					const is_starred = req.body.is_starred === "true" || false;
					task.is_starred = is_starred;
				}
				if (req.body.reset_bumps) {
					task.bumps = 0;
				}
				return task.save();
			}).then(task => {
				res.send(renderer.render('views/task.html', { task }));
			}).catch(err => {
				next(err);
			});
			break;
		case "DELETE":
			Task.findByIdAndRemove(req.params.id).exec()
				.then(task => {
					res.redirect('/');
				}).catch(err => {
					next(err);
				});
			break;
		default:
			const err = new Error('Can’t post to task');
			err.status = 405;
			return next(err);
			break;
	}
}

function create(req, res, next) {
	switch(req.body._method) {
		case "PATCH": // UPDATE
			Task.find().exec().then(tasks => {
				tasks.forEach(task => {
					if (req.body[`${task.id}__task`] === 'on') {
						if (req.body._action === 'done') {
							task.is_done = true;
							task.is_actionable = true;
							task.is_starred = false;
							task.save();
						}
						if (req.body._action === 'star') {
							task.is_starred = true;
							task.save();
						}
						if (req.body._action === 'unstar') {
							task.is_starred = false;
							task.save();
						}
					}
				});
			}).then(() => {
				res.redirect(req.body.redirect || '/');
			}).catch(err => {
				next(err);
			})
			break;
		default:  // CREATE
			const task = new Task();
			task.content = req.body.content;
			task.is_done = false;
			task.is_actionable = !!req.body.is_actionable || false;
			task.is_starred = !!req.body.is_starred || false;
			if (task.is_starred) {
				task.is_actionable = true;
			}
			task.save()
				.then(task => {
					// res.redirect(`/tasks/${task.id}`);
					res.redirect(`/`);
				}).catch(err => {
					next(err);
				});
			break;
	}
}

function list(req, res, next) {
	let query = {
		is_actionable: true,
		is_done: {$ne: true}
	};
	if (req.query.show_all) {
		delete query.is_actionable;
	}
	Task.find(query).sort({ is_starred: -1, bumps: -1, is_done: 1, is_actionable: -1, content: 1 }).exec()
		.then(tasks => {
			res.format({
				'text/html': () => res.send(renderer.render('views/index.html', { tasks })),
				'application/json': () => res.json({ tasks })
			})
		}).catch(err => {
			next(err);
		})
}

router.route('/')
	.get(list)
	.post(create);

router.route('/:id/edit')
	.get(edit)

router.route('/:id')
	.get(show)
	.post(update);

module.exports = router;
