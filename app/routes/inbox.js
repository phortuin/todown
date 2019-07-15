const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/inbox/get'))

module.exports = router
