const nunjucks = require('nunjucks');
const marked = require('marked');

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
})

markdownRenderer.listitem = (text) => `
	<li oncontextmenu="s=window.getSelection();r=document.createRange();r.selectNodeContents(this);s.removeAllRanges();s.addRange(r)">${text}</li>
`

renderer.addFilter('markdown', string => {
	return string ? marked(string, { renderer: markdownRenderer }) : ''; // marked will throw error on an empty string
});

renderer.addFilter('titleize', string => {
	const hasEnd = ['.', '?', '!', ')', ']', '/'].some(ending => string.endsWith(ending))
	return hasEnd ? string : `${string}.`;
})

renderer.addFilter('linkize', string => {
	return string.replace(/@([^\s]+)/g, '<a class="searchlink" href="/search?q=$1&amp;exact=true">@$1</a>')
})

module.exports = renderer;
