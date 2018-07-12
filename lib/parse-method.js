/**
 * Parse _method field into req.method
 */
module.exports = (req, res, next) => {
	if (req.body._method) {
		req.originalMethod = req.method
		req.method = req.body._method
		delete req.body._method
	}
	next()
}
