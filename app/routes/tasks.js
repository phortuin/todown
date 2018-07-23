const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/tasks/list'))
	.post(require('@routes/tasks/post'))
	.patch(require('@routes/tasks/bulk'))

router.route('/:id')
	.get(require('@routes/tasks/get'))
	.patch(require('@routes/tasks/patch'))
	.delete(require('@routes/tasks/delete'))

router.route('/:id/edit')
	.get(require('@routes/tasks/edit'))

module.exports = router
