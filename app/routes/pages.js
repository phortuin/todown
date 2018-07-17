const express = require('express')
const router = express.Router()
const renderer = require('@lib/renderer');

router.route('/')
	.get(require('@routes/pages/list'))
	.post(require('@routes/pages/post'))

router.route('/:id')
	.get(require('@routes/pages/get'))

router.route('/create')
	.get((req, res, next) => res.send(renderer.render('views/page-create.html')))

module.exports = router
