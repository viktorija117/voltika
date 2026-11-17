import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach } from 'vitest'

// Every mounted component is removed after its test, so timers, listeners and
// tags added to <head> never leak into the next test.
enableAutoUnmount(afterEach)

// jsdom has <dialog> but not its showModal() and close() methods yet.
// Minimal stand-ins: toggle the `open` attribute and fire `close` like a browser does.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}

// The cart is saved in localStorage; start every test with an empty one.
beforeEach(() => {
  localStorage.clear()
})
