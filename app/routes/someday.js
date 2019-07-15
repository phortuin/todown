const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/someday/get'))

module.exports = router
