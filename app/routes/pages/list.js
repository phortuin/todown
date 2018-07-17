const Page = require('@models/page')
const renderer = require('@lib/renderer');

module.exports = function get(req, res, next) {
	Page.find().sort({ content: 1 }).exec()
		.then(pages => res.send(renderer.render('views/pages.html', { pages })))
		.catch(next)
}
