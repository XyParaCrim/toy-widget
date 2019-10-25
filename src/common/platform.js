import {$window} from '../util'
import EventDispatcher from './event-dispatcher'

const focusOptions = {
  useCapture: true,
  default: false,
  stop: false
}

const EventTarget = {
  asControl (control) {
    const el = control.eventTarget || control.el // TODO

    $window.on(el, 'mousedown.control', e => EventDispatcher.focus(control), focusOptions)
    $window.on(el, 'mouseup.control', e => EventDispatcher.focus(control), focusOptions)
    $window.on(el, 'contextmenu.control', e => EventDispatcher.focus(control), focusOptions)

    $window.on(el, 'mouseenter.control', e => EventDispatcher.enter(control, e))
    $window.on(el, 'mouseleave.control', e => EventDispatcher.leave(control, e))
  },
  asDisplay (display) {
    const el = display.eventTarget || display.el // TODO
    const dispatcher = EventDispatcher.create(display)

    $window.on(el, 'contextmenu.display', e => dispatcher.dispatch('contextmenu', e))

    $window.on(el, 'mousedown.display', e => dispatcher.dispatch('mousedown', e))
    $window.on(el, 'mouseup.display', e => dispatcher.dispatch('mouseup', e))
    $window.on(el, 'mousemove.display', e => dispatcher.dispatch('mousemove', e))

    $window.on(el, 'click.display', e => dispatcher.dispatch('click', e))
    $window.on(el, 'dblclick.display', e => dispatcher.dispatch('dblclick', e))

    $window.on(document, 'keydown.display', e => dispatcher.dispatch('keydown', e), {default: false})
  }
}

const Platform = {
  addDisplay (display) {
    EventTarget.asDisplay(display)
  },
  removeDisplay (display) {
    $window.off(display.el, '*.display')
    EventDispatcher.dispose(display)
  },
  addDisplayEle (widget) {
    EventTarget.asControl(widget)
  },
  removeDisplayEle (widget) {
    $window.off(widget.el, '*.control')
  },
  drag (widget) {
    EventDispatcher.drag(widget)
  }
}

export default Platform
