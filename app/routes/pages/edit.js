const Page = require('@models/page')
const renderer = require('@lib/renderer');

module.exports = (req, res, next) => {
	Page.findById(req.params.id).exec()
		.then(page => res.send(renderer.render('views/page-edit.html', { page })))
		.catch(next)
}
