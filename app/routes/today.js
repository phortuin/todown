const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/today/get'))

module.exports = router
