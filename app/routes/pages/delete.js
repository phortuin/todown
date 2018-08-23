const Page = require('@models/page')

module.exports = (req, res, next) => {
	Page.findByIdAndRemove(req.params.id).exec()
		.then(() => res.redirect(req.query.redirect || '/'))
		.catch(next)
}
