const Page = require('@models/page')
const moment = require('moment')

module.exports = (req, res, next) => {
	let redirectTarget
	Page.findById(req.params.id).exec()
		.then(page => {
			redirectTarget = `/pages/${page.id}`
			if (req.body._action === 'sticky' && !req.body.is_sticky) {
				page.is_sticky = false
			}
			if (req.body.is_sticky) {
				page.is_sticky = true
			}
			if (req.body.content) {
				page.content = req.body.content
			}
			if (req.body.tags) {
				page.tags = req.body.tags
			}
			return page.save()
		}).then(page => res.redirect(redirectTarget))
		.catch(next)
}
