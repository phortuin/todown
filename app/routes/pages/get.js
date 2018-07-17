const Page = require('@models/page')
const renderer = require('@lib/renderer');

module.exports = function get(req, res, next) {
	Page.findById(req.params.id).exec()
		.then(page => res.send(renderer.render('views/page.html', { page })))
		.catch(next)
}
