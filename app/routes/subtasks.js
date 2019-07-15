const express = require('express')
const router = express.Router()

router.route('/')
	.post(require('@routes/subtasks/post'))

router.route('/:id')
	.patch(require('@routes/subtasks/patch'))

module.exports = router
