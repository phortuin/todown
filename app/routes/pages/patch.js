const Page = require('@models/page')
const moment = require('moment')

module.exports = (req, res, next) => {
	Page.findById(req.params.id).exec()
		.then(page => {
			page.content = req.body.content
			return page.save()
		}).then(page => res.redirect(`/pages/${page.id}`))
		.catch(next)
}
