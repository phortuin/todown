{

	// removing hidden will trigger redraw, which breaks transition. using timeout will make sure the transition happens
	function removeHiddenAndTransit(element) {
		element.removeAttribute('hidden')
		setTimeout(() => element.classList.remove('closed'), 0)
	}

	function toArray(arrayLike) {
		return [].slice.call(arrayLike)
	}

	function someTasksChecked(taskInputArray) {
		return taskInputArray.some(taskInputItem => taskInputItem.checked)
	}

	const formTriggers = toArray(document.querySelectorAll('[data-trigger-form]'))
	const sidebarOpeners = toArray(document.querySelectorAll('[data-open-sidebar]'))
	const taskForm = document.querySelector('[data-task-form]')
	const sidemenuEl = document.getElementById('sidemenu')
	const actionDefault = document.getElementById('action-default')
	const actionBulk = document.getElementById('action-bulk')

	formTriggers.forEach(formTrigger => {
		formTrigger.addEventListener('click', event => {
			event.preventDefault()
			let formTriggerTarget = document.getElementById(event.target.dataset.triggerForm)
			removeHiddenAndTransit(formTriggerTarget)
		})
	})

	sidebarOpeners.forEach(sidebarOpener => {
		sidebarOpener.addEventListener('click', event => {
			event.preventDefault()
			removeHiddenAndTransit(sidemenuEl)
		})
	})

	if (taskForm) {
		const taskFormInputs = toArray(taskForm.elements)
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
}
