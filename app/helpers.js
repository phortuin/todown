const moment = require('moment');

// Regex matches anything on line one but without optional pound marks (Markdown heading notation)
// Group 2 is the match we're looking for.
//
// Note: Mongoose Schema will bind `this` to itself
function getTitleFromMarkdown() {
	const matches = this.content.match(/^(#{1,}\s+)?(.+)/m);
	return matches ? matches[2].trim() : '';
}

function getScheduledHumanReadable() {
	let theDate = moment(this.scheduled_date)
	if (moment().startOf('day').isSame(this.scheduled_date)) {
		return 'today';
	}
	if (moment().add(1, 'd').startOf('day').isSame(this.scheduled_date)) {
		return 'tomorrow';
	}
	if (theDate.isValid()) {
		if (theDate.isAfter(moment().startOf('day')) && theDate.isBefore(moment().add(6, 'd'))) {
			return theDate.format('dddd')
		}
		if (theDate.isAfter(moment().startOf('day'))) {
			return theDate.format('D MMM')
		}
		return theDate.format('D MMM YYYY')
	}
}

function getScheduledForInput() {
	return this.scheduled_date ? moment(this.scheduled_date).format('YYYY-MM-DD') : ''
}

function getIsToday() {
	return moment().startOf('day').isSame(this.scheduled_date)
}

function getIsTomorrow() {
	return moment().add(1, 'd').startOf('day').isSame(this.scheduled_date)
}

function getNumSubtasksDone() {
	 return this.subtasks.reduce((count, subtask) => {
	 	count += subtask.is_done ? 1 : 0
	 	return count
	}, 0)
}

module.exports = { getTitleFromMarkdown, getScheduledHumanReadable, getScheduledForInput, getIsToday, getIsTomorrow, getNumSubtasksDone }
