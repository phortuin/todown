const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/review/get'))
	.post(require('@routes/review/post'))

module.exports = router
