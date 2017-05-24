const express = require('express');
const router = express.Router();
const Task = require('../models/task')

router.route('/unstar_all')
	.post((req, res, next) => {
		Task.find()
			.exec()
			.map(task => {
				task.is_starred = false;
				task.save()
			}).then(() => {
				res.json({'status': 'unstarred all'});
			}).catch(err => {
				res.json({'status': 'failed', err});
			})
	});

router.route('/reset_bumps')
	.post((req, res, next) => {
		Task.find()
			.exec()
			.map(task => {
				task.bumps = 0;
				task.save()
			}).then(() => {
				res.json({'status': 'bumps all 0'});
			}).catch(err => {
				res.json({'status': 'failed', err});
			})
	});

router.route('/unstar_done_tasks')
	.post((req, res, next) => {
		Task.find({ is_done: true })
			.exec()
			.map(task => {
				task.is_starred = false;
				task.save()
			}).then(() => {
				res.json({'status': 'unstarred all done tasks'});
			}).catch(err => {
				res.json({'status': 'failed', err});
			})
	});

module.exports = router;
