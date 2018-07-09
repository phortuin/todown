const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const Page = require('../models/page')
const Task = require('../models/task')
const renderer = require('../../lib/renderer');

function getTaggedTasks(page) {
	if (page.tags) {
		return new Promise((resolve, reject) => {
			Task.find({ $text: { $search: page.tags }, is_done: false}).sort({ is_starred: -1, bumps: -1, is_done: 1, is_actionable: -1, content: 1 }).exec()
				.then(tasks => resolve([page, tasks]))
				.catch(reject)
		})
	} else {
		return Promise.resolve([page, []])
	}
}

function show(req, res, next) {
	Page.findById(req.params.id).populate('tasks', null, { is_done: false }).populate('pages').populate('parent').exec()
		.then(getTaggedTasks)
		.spread((page, tasks) => {
			const uniqueKeys = []
			const mergedTasks = [...page.tasks, ...tasks].reduce((collection, task) => {
				if (!uniqueKeys.includes(task.id)) {
					collection.push(task)
					uniqueKeys.push(task.id)
				}
				return collection
			}, [])
			page.tasks = mergedTasks
			res.send(renderer.render('views/page.html', { page }))
		})
		.catch(next)
}

function edit(req, res, next) {
	Promise.all([
		Page.findById(req.params.id).exec(),
		Page.find()
	]).spread((page, pages) => res.send(renderer.render('views/page-edit.html', { page, pages })))
	.catch(next)
}

function update(req, res, next) {
	switch(req.body._method) {
		case "PUT":
			Page.findById(req.params.id).exec().then(page => {
				if (req.body.content) {
					page.content = req.body.content;
				}
				if (req.body.page) {
					page.parent = req.body.page;
				}
				if (req.body.tags) {
					page.tags = req.body.tags;
				}
				if (req.body.is_sticky) {
					page.is_sticky = true;
				}
				return page.save();
			})
				.then(page => res.send(renderer.render('views/page-edit.html', { page })))
				.catch(next)
			break;
		case "DELETE":
			Page.findByIdAndRemove(req.params.id).exec()
				.then(page => res.redirect('/pages'))
				.catch(next);
			break;
		default:
			const err = new Error('Can’t post to page');
			err.status = 405;
			return next(err);
			break;
	}
}

function create(req, res, next) {
	const page = new Page();
	page.content = req.body.content;
	page.save()
		.then(page => res.redirect(`/pages/${page.id}`))
		.catch(next)
}

function list(req, res, next) {
	Page.find().sort({ is_sticky: -1, content: 1 }).populate('parent').populate('pages').exec()
		.then(pages => res.send(renderer.render('views/pages.html', { pages: pages })))
		.catch(next)
}

function makenew(req, res, next) {
	res.send(renderer.render('views/page-new.html'));
}

router.route('/')
	.get(list)
	.post(create);

router.route('/create')
	.get(makenew)

router.route('/:id')
	.get(show)
	.post(update);

router.route('/:id/edit')
	.get(edit)

module.exports = router;
