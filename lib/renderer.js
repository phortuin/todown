const nunjucks = require('nunjucks')
const marked = require('marked')
const moment = require('moment')
const prism = require('prismjs')

const renderer = new nunjucks.Environment(
	new nunjucks.FileSystemLoader('src', {
		noCache: true,
		watch: false
	}),
	{ autoescape: true }
);

const markdownRenderer = new marked.Renderer()

// Use github flavored markdown; newlines are <br>s
marked.setOptions({
	gfm: true,
	breaks: true,
	smartypants: true
})

markdownRenderer.code = (code, language) => {
	language = (prism.languages.hasOwnProperty(language)) ? language : 'markup'
	return `<pre class="language-${language}"><code>${ prism.highlight(code, prism.languages[language]) }</code></pre>`
}

renderer.addFilter('markdown', string => {
	return string ? marked(string, { renderer: markdownRenderer }) : ''; // marked will throw error on an empty string
});

renderer.addFilter('titleize', string => {
	const hasEnd = ['.', '?', '!', ')', ']', '/'].some(ending => string.endsWith(ending))
	return hasEnd ? string : `${string.trim()}.`;
})

module.exports = renderer;
