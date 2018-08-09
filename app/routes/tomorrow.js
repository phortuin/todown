const express = require('express')
const router = express.Router()

router.route('/')
	.get(require('@routes/tomorrow/get'))

module.exports = router
