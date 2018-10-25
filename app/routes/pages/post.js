const Page = require('@models/page')

module.exports = (req, res, next) => {
	const page = new Page()
	page.content = req.body.content
	page.is_sticky = false
	page.save()
		.then(page => res.redirect(`pages/${page.id}`))
		.catch(next)
}
