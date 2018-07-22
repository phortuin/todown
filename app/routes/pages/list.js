const Page = require('@models/page')
const renderer = require('@lib/renderer');

module.exports = (req, res, next) => {
	Page.find().sort({ is_sticky: -1, content: 1 }).exec()
		.then(pages => res.send(renderer.render('views/pages.html', { pages })))
		.catch(next)
}
