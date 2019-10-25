import {$fn} from '../../../../util'

const bubblableEvent = Array.of(
    'click',
    'dblclick',

    'mousedown',
    'mouseup',
    'mousemove',

    'dragover',
    'drop',

    'contextmenu'
)

const noBubblableEvent = Array.of(
    'mouseenter',
    'mouseleave',

    'dragstart',
    'dragend',
    'drag',

    'dragenter',
    'dragleave',

    'keydown',
    'keyup'
)

export default class BaseTracker {
  active (editPart) {
    this.deactive = this.join(editPart, editPart)
  }

  join (widget, host) {
    const bubblableListeners = bubblableEvent.map(eventName => {
      let listener = e => widget.root.eventBus.bubble(eventName, e, host)

      widget.on(eventName, listener)

      return listener
    })

    const noBubblableListeners = noBubblableEvent.map(eventName => {
      let listener = e => widget.root.eventBus.noBubble(eventName, e, host)

      widget.on(eventName, listener)

      return listener
    })

    return function deactive () {
      bubblableEvent.forEach((event, index) => widget.off(event, bubblableListeners[index]))

      noBubblableEvent.forEach((event, index) => widget.off(event, noBubblableListeners[index]))
    }
  }
}

BaseTracker.prototype.click = $fn.optionalHook
BaseTracker.prototype.dblclick = $fn.optionalHook

BaseTracker.prototype.mousedown = $fn.optionalHook
BaseTracker.prototype.mouseup = $fn.optionalHook
BaseTracker.prototype.mousemove = $fn.optionalHook

BaseTracker.prototype.drag = $fn.optionalHook
BaseTracker.prototype.dragstart = $fn.optionalHook
BaseTracker.prototype.dragend = $fn.optionalHook

BaseTracker.prototype.dragover = $fn.optionalHook
BaseTracker.prototype.dragenter = $fn.optionalHook
BaseTracker.prototype.dragleave = $fn.optionalHook
BaseTracker.prototype.drop = $fn.optionalHook

BaseTracker.prototype.keydown = $fn.optionalHook
BaseTracker.prototype.keyup = $fn.optionalHook

BaseTracker.prototype.contextmenu = $fn.optionalHook
