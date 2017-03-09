const nunjucks = require('nunjucks');
const marked = require('marked');

const renderer = new nunjucks.Environment(
	new nunjucks.FileSystemLoader('src', {
		noCache: true,
		watch: false
	}),
	{ autoescape: true }
);

renderer.addFilter('markdown', (string) => {
	return string ? marked(string) : ''; // marked will throw error on an empty string
});

module.exports = renderer;
