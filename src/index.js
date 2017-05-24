(app => {

	app.review = {
		enhance: () => {
			[].forEach.call(document.querySelectorAll('[data-review]'), (element) => {
				new Review(element);
			})
		}
	}

	class Review {
		constructor(element) {
			this.tasks = element.querySelectorAll('[data-task]');
			this.taskIds = [].map.call(this.tasks, task => task.id);
			this.addListeners();
		}

		addListeners() {
			[].forEach.call(this.tasks, task => task.addEventListener('click', this.handleTaskClick.bind(this)));
		}

		handleTaskClick(event) {
			const id = event.currentTarget.id;
			const clickedTag = event.target.tagName.toLowerCase();
			if (clickedTag === 'input') {
				setTimeout(() => this.moveToNextTask(id), 200);
			}
			if (event.target.getAttribute('href') === '#') {
				event.preventDefault();
				this.moveToNextTask(id);
			}
		}

		moveToNextTask(id) {
			const taskIndex = this.taskIds.indexOf(id);
			const nextTaskId = this.taskIds[taskIndex + 1] || 'submit';
			window.location.href = `#${nextTaskId}`;
		}

	}

})(window.app = window.app || {});

(app => {
	app.review.enhance();
})(window.app = window.app || {});
