const express = require('express')
const router = express.Router()
const renderer = require('@lib/renderer');

router.route('/')
	.get((req, res, next) => res.send(renderer.render('views/sections.html', {})))

module.exports = router
