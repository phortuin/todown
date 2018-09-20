{

	// constants; element selectors
	const KEY_ESCAPE = 27
	const mainElement = document.querySelector('[role=main]')
	const overlay = document.querySelector('[data-overlay]')
	const modalOpeners = toArray(document.querySelectorAll('[data-trigger-modal]'))
	const modalClosers = toArray(document.querySelectorAll('[data-close-modal]'))
	const sidebarOpeners = toArray(document.querySelectorAll('[data-open-sidebar]'))
	const taskForm = document.querySelector('[data-task-form]')
	const sidemenuEl = document.querySelector('[data-sidemenu]')
	const actionBar = document.querySelector('[data-action]')
	const reviewTaskInputs = toArray(document.querySelectorAll('[data-review-list] input, [data-review-list] [data-skip]'))
	const modal = document.querySelector('[data-modal]')
	const taskDeleters = toArray(document.querySelectorAll('[data-delete-task]'))
	const editTaskLink = document.querySelector('[data-edit-task]')
	const autofocusTextareas = toArray(document.querySelectorAll('textarea[autofocus]'))

	// helpers

	function preventNavigationClick(event) {
		if (event.currentTarget.tagName === 'A') {
			event.preventDefault()
		}
	}

	function blockBody() {
		mainElement.classList.add('blocked')
	}

	function unblockBody() {
		mainElement.classList.remove('blocked')
	}

	function removeHiddenAndTransit(element) {
		element.removeAttribute('hidden')
		setTimeout(() => element.classList.remove('closed'), 0) // removing hidden will trigger redraw, which breaks transition. using timeout will make sure the transition happens
	}

	function transitAndAddHidden(element) {
		element.classList.add('closed')
		element.addEventListener('transitionend', setHiddenAttribute)
	}

	function setHiddenAttribute(event) {
		let element = event.target
		element.setAttribute('hidden', 'hidden')
		element.removeEventListener('transitionend', setHiddenAttribute)
	}

	function toArray(arrayLike) {
		return [].slice.call(arrayLike)
	}

	function someTasksChecked(taskInputArray) {
		return taskInputArray.some(taskInputItem => taskInputItem.checked)
	}

	function closeModal(event) {
		if (!event.keyCode || event.keyCode && event.keyCode === KEY_ESCAPE) {
			preventNavigationClick(event)
			unblockBody()
			removeHiddenAndTransit(actionBar)
			transitAndAddHidden(overlay)
			transitAndAddHidden(modal)
		}
	}

	function openModal(event) {
		preventNavigationClick(event)
		blockBody()
		transitAndAddHidden(actionBar)
		removeHiddenAndTransit(overlay)
		removeHiddenAndTransit(modal)
		setEditorFocus()
	}

	function openSidebar(event) {
		preventNavigationClick(event)
		removeHiddenAndTransit(sidemenuEl)
	}

	function setEditorFocus() {
		let textarea = modal.querySelector('textarea')
		if (textarea) {
			textarea.focus()
			moveCursorToEnd(textarea)
		}
	}

	function moveCursorToEnd(textarea) {
		if (textarea instanceof Event) {
			textarea = textarea.currentTarget
		}
		let length = textarea.value.length
		textarea.setSelectionRange(length, length)
		textarea.scrollTop = 99999
	}

	// handlers

	overlay.addEventListener('click', closeModal)
	document.addEventListener('keyup', closeModal)
	modalClosers.forEach(modalCloser => modalCloser.addEventListener('click', closeModal))
	modalOpeners.forEach(modalOpener => modalOpener.addEventListener('click', openModal))
	sidebarOpeners.forEach(sidebarOpener => sidebarOpener.addEventListener('click', openSidebar))
	autofocusTextareas.forEach(textarea => textarea.addEventListener('focus', moveCursorToEnd))
	taskDeleters.forEach(taskDeleter => taskDeleter.addEventListener('click', event => {
		preventNavigationClick(event)
		const id = event.currentTarget.id
		const targetId = id.replace(/delete/, 'content')
		document.getElementById(targetId).value = ''
	}))

	if (editTaskLink) {
		editTaskLink.addEventListener('click', event => {
			if (event.currentTarget.tagName !== 'A') {
				let id = event.currentTarget.dataset.editTask
				window.location.href = `/tasks/${id}/edit`
			}
		})
	}

	if (taskForm) {
		const taskFormInputs = toArray(taskForm.elements)
		const actionDefault = document.getElementById('action-default')
		const actionBulk = document.getElementById('action-bulk')
		taskForm.addEventListener('change', event => {
			if (someTasksChecked(taskFormInputs)) {
				actionDefault.setAttribute('hidden', 'hidden')
				actionBulk.removeAttribute('hidden')
			} else {
				actionDefault.removeAttribute('hidden')
				actionBulk.setAttribute('hidden', 'hidden')
			}
		})
	}

	function getContainerMovementDistance(targetElementId) {
		let targetOffset = document.getElementById(targetElementId).getBoundingClientRect().top
		let containerOffset = mainElement.getBoundingClientRect().top
		let totalOffset = targetOffset - containerOffset
		return window.scrollY - totalOffset
	}

	if (reviewTaskInputs) {
		reviewTaskInputs.forEach(reviewTaskInput => {
			reviewTaskInput.addEventListener('click', event => {
				preventNavigationClick(event)
				let targetElementId = reviewTaskInput.dataset.nextTaskId || 'submit'
				let distance = getContainerMovementDistance(targetElementId)

				function onReviewTaskTransitionEnd() {
					mainElement.style.transition = null
					mainElement.style.transform = null
					mainElement.removeEventListener('transitionend', onReviewTaskTransitionEnd)
					window.location.href = `#${targetElementId}`
				}

				// Let user see that their action was recorded by delaying for 100ms
				setTimeout(() => {
					mainElement.style.transition = 'transform 200ms ease-in-out'
					mainElement.style.transform = `translateY(${distance}px)`
					mainElement.addEventListener('transitionend', onReviewTaskTransitionEnd)
				}, 100)
			})
		})
	}
}
