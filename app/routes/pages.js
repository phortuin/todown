const express = require('express')
const router = express.Router()
const renderer = require('@lib/renderer');

router.route('/')
	.get(require('@routes/pages/list'))
	.post(require('@routes/pages/post'))

router.route('/:id')
	.get(require('@routes/pages/get'))
	.patch(require('@routes/pages/patch'))
	.delete(require('@routes/pages/delete'))

router.route('/:id/edit')
	.get(require('@routes/pages/edit'))

module.exports = router
