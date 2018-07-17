{

	// removing hidden will trigger redraw, which breaks transition. using timeout will make sure the transition happens
	function removeHiddenAndTransit(element) {
		element.removeAttribute('hidden')
		setTimeout(() => element.classList.remove('closed'), 0)
	}

	function toArray(arrayLike) {
		return [].slice.call(arrayLike)
	}

	const formTriggers = toArray(document.querySelectorAll('[data-trigger-form]'))
	const sidebarOpeners = toArray(document.querySelectorAll('[data-open-sidebar]'))
	const sidemenuEl = document.getElementById('sidemenu')

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
}
