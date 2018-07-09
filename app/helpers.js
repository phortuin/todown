const moment = require('moment');

// Regex matches anything on line one but without optional pound marks (Markdown heading notation)
// Group 2 is the match we're looking for.
//
// Note: Mongoose Schema will bind `this` to itself
function getTitleFromMarkdown() {
	const matches = this.content.match(/^(#{1,}\s+)?(.+)/m);
	return matches ? matches[2] : '';
}

function getScheduledHumanReadable() {
	if (moment().startOf('day').isSame(this.scheduled_date)) {
		return 'today';
	}
	if (moment().add(1, 'd').startOf('day').isSame(this.scheduled_date)) {
		return 'tomorrow';
	}
	if (moment().add(7, 'd').startOf('week').isSame(this.scheduled_date)) {
		return 'next week';
	}
}

module.exports = { getTitleFromMarkdown, getScheduledHumanReadable }
