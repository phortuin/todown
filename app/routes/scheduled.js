const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/scheduled/get'))

module.exports = router
