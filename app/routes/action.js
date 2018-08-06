const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/action/get'))
	.post(require('@routes/action/post'))

module.exports = router
