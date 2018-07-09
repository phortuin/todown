const mongoose = require('mongoose');
const { getTitleFromMarkdown } = require('../helpers')
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const PageSchema = new mongoose.Schema({
	content: String,
	tags: String,
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
	parent: { type: Schema.Types.ObjectId, ref: 'Page' },
	is_sticky: false
});

PageSchema.virtual('pages', {
	ref: 'Page',
	localField: '_id',
	foreignField: 'parent'
})
PageSchema.index({ content: 'text' }); // searchable
PageSchema.virtual('title').get(getTitleFromMarkdown);

module.exports = mongoose.model('Page', PageSchema);
