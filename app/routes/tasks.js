const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const moment = require('moment');

const Task = require('../models/task')
const Page = require('../models/page')
const renderer = require('../../lib/renderer');

function show(req, res, next) {
	Task.findById(req.params.id).populate('page').exec()
		.then(task => {
			res.send(renderer.render('views/task.html', { task: task.toObject({ virtuals: true }) }));
		}).catch(err => {
			next(err);
		})
}

function edit(req, res, next) {
	Promise.all([
		Task.findById(req.params.id).exec(),
		Page.find().exec()
	]).spread((task, pages) => {
		res.send(renderer.render('views/task-edit.html', { task, pages }))
	}).catch(next)
}

function put(req, res, next) {
	Task.findById(req.params.id).exec().then(task => {
		if (req.body.content) {
			task.content = req.body.content;
			// actionable is part of form that submits content
			task.is_actionable = !!req.body.is_actionable;
			task.is_quick = !!req.body.is_quick;
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
		if (req.body.scheduled_date) {
			switch (req.body.scheduled_date) {
				case 'today':
					task.scheduled_date = moment().startOf('day');
					break;
				case 'tomorrow':
					task.scheduled_date = moment().add(1, 'd').startOf('day');
					break;
				case 'next_week':
					task.scheduled_date = moment().add(7, 'd').startOf('week');
					break;
				default:
					task.scheduled_date = null;
					break;
			}
		}
		if (req.body.page) {
			return task.save()
				.then(task => {
					return Page.findById(req.body.page).exec()
						.then(page => {
							page.tasks.push(task);
							return page.save().then(() => task); // looks weird, but promise needs to return task
						})
				});
		} else {
			return task.save();
		}
	}).then(task => {
		res.send(renderer.render('views/task.html', { task }));
	}).catch(err => {
		next(err);
	});
}

function deleteTask(req, res, next) {
	Task.findByIdAndRemove(req.params.id).exec()
		.then(task => {
			res.redirect('/');
		}).catch(err => {
			next(err);
		});
}

function patch(req, res, next) {
	Task.find().exec().then(tasks => {
		tasks.forEach(task => {
			if (req.body[`${task.id}__task`] === 'on') {
				if (req.body._action === 'done') {
					task.is_done = true;
					task.is_actionable = true;
					task.is_starred = false;
					task.save();
				}
				if (req.body._action === 'not_today') {
					task.scheduled_date = null;
					task.save()
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
}

function create(req, res, next) {
	const task = new Task();
	task.content = req.body.content;
	task.is_done = false;
	task.is_actionable = !!req.body.is_actionable || false;
	task.is_starred = !!req.body.is_starred || false;
	task.is_quick = !!req.body.is_quick || false;
	if (task.is_starred) {
		task.is_actionable = true;
	}
	task.save()
		.then(task => {
			// res.redirect(`/tasks/${task.id}`);
			if (req.body.page) {
				return Page.findById(req.body.page).exec()
					.then(page => {
						page.tasks.push(task);
						return page.save()
					})
					.then(page => {
						res.redirect(`/pages/${ page.id }#tasks`);
					})
					.catch(next)
			}
			res.redirect(`/tasks/${task.id}/edit`);
		}).catch(err => {
			next(err);
		});
}

function list(req, res, next) {
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
				'text/html': () => res.send(renderer.render('views/index.html', { quick, tasks, pages })),
				'application/json': () => res.json({ tasks })
			})
		}).catch(err => {
			next(err);
		})
}

router.route('/')
	.get(list)
	.post(create)
	.patch(patch);

router.route('/:id/edit')
	.get(edit)

router.route('/:id') // add allowed methods
	.get(show)
	.put(put)
	.delete(deleteTask)

module.exports = router;
