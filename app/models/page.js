const mongoose = require('mongoose')
const { getTitleFromMarkdown } = require('../helpers')
mongoose.Promise = require('bluebird')

const PageSchema = new mongoose.Schema({
	content: String,
	tags: String,
	is_sticky: { type: Boolean }
})

PageSchema.virtual('title').get(getTitleFromMarkdown)

module.exports = mongoose.model('Page', PageSchema)
