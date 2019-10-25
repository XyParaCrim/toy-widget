import {$object, $window} from '../util'
import Event from './event'

const MouseState = {
  none: 0,
  down: 1,
  up: 2,
  drag: 3,
  move: 4
}

const area = '_area'

function dispatch (dispatcher, eventName, nativeEvent) {
  dispatchEvent[eventName].call(dispatcher, nativeEvent)
}

function walkArea (tail, exclude) {
  let count = 5

  do {
    if (tail !== exclude) {
      return tail
    }
    count--
    if (count === 0) { debugger; break }
  } while ((tail = tail[area].prev))

  return exclude
}

function clearArea (tail) {
  let prev
  while (tail) {
    prev = tail[area].prev
    tail[area].prev = null
    tail = prev
  }
}

function sameLocation (location1, location2) {
  return location1.x === location2.x && location1.y === location2.y
}

const dispatchEvent = {
  /* click */
  click (event) {
    this.mouseState = MouseState.up

    this.notify('click', this.focusTarget, event)
  },
  dblclick (event) {
    this.mouseState = MouseState.up

    this.notify('dblclick', this.focusTarget, event)
  },

  /* mouse */
  mousedown (event) {
    if (event.button === 0) {
      this.mouseState = MouseState.down

      this.notify('mousedown', this.focusTarget, event)
    }
  },
  mouseup (event) {
    if (this.mouseState === MouseState.drag) {
      return
/*      dispatch(this, 'dragend', event)
      return this.notify('mouseup', this.enterTarget, event)*/
    }

    this.mouseState = MouseState.up
    this.notify('mouseup', this.enterTarget, event)
  },
  mousemove (event) {
    if (this.mouseState === MouseState.drag) {
      // return
      return dispatch(this, 'drag', event)
    }

    if (this.mouseState === MouseState.down) {
      return dispatch(this, 'dragstart', event)
    }

    // TODO
    if (this.mouseState === MouseState.move && event.buttons === 1) {
      this.mouseState === MouseState.down
      return dispatch(this, 'dragstart', event)
    }

    this.mouseState = MouseState.move
    return this.notify('mousemove', this.enterTarget, event)
  },
  mouseenter (event) {
    if (this.mouseState === MouseState.drag) {
      return dispatch(this, 'dragenter', event)
    }

    this.notify('mouseout', this.enterTarget[area].prev, event)
    this.notify('mouseenter', this.enterTarget, event)
    this.notify('mousein', this.enterTarget, event)
  },
  mouseleave (event) {
    if (this.mouseState === MouseState.drag) {
      return dispatch(this, 'dragleave', event)
    }

    this.notify('mouseout', this.leaveTarget, event)
    this.notify('mouseleave', this.leaveTarget, event)
    this.notify('mousein', this.enterTarget, event)
  },

  /* drag target */
  dragstart (event) {
    this.dragTarget = this.focusTarget
    this.mouseState = MouseState.drag
    this.notify('dragstart', this.dragTarget, event)

    $window.on(document, 'mouseup.global', e => {
      if (this.mouseState === MouseState.drag) {
        dispatch(this, 'dragend', event)
        this.notify('mouseup', this.enterTarget, event)
      }

      $window.off(document, 'mouseup.global')
    })
  },
  dragend (event) {
    this.notify('dragend', this.dragTarget, event)

    this.mouseState = MouseState.up
    this.notify('drop', this.enterTarget, event)

    this.dragTarget = null
  },
  drag (event) {
    this.notify('drag', this.dragTarget, event)
    dispatch(this, 'dragover', event)
  },
  dragcancell () {}, // TODO

  /* on drag target */
  dragenter (event) {
    this.notify('dragenter', walkArea(this.enterTarget, this.dragTarget), event)
  },
  dragover (event) {
    this.notify('dragover', walkArea(this.enterTarget, this.dragTarget), event)
  },
  dragleave (event) {
    this.notify('dragleave', walkArea(this.leaveTarget, this.dragTarget), event)
  },
  drop (event) {
    this.notify('drop', walkArea(this.enterTarget, this.dragTarget), event)
  },

  /* key */
  keydown (event) {
    if (EventDispatcher.focusTarget === this.display) {
      this.notify(`keydown:${$window.keyStr(event)}`, this.display, event)
      event.preventDefault()
    }
  },
  keyup (event) {
    if (EventDispatcher.focusTarget === this.display) {
      this.notify(`keyup:${$window.keyStr(event)}`, this.display, event)
      event.preventDefault()
    }
  },

  'contextmenu' (event) {
    // TODO
    this.notify('contextmenu', this.focusTarget, event)
  }
}

const cached = new Map()

class EventDispatcher {

  static create (display) {
    cached.size === 0 && $window.on(document, 'mousedown.focus', e => (this.focusTarget = null), {useCapture: true, default: false, stop: false})

    let dispatcher = new EventDispatcher(display)

    cached.set(display, dispatcher)
    return dispatcher
  }

  static focus (target) {
    let dispatcher = cached.get(target.root)
    if (dispatcher) {
      dispatcher.focusTarget = target
      EventDispatcher.focusTarget = dispatcher.display
    }
  }

  static dispatch (target, eventName, nativeEvent) {
    let dispatcher = cached.get(target.root)

    dispatcher && dispatcher.dispatch(eventName, nativeEvent)
  }

  static dispose (target) {
    cached.delete(target.root)

    cached.size === 0 && $window.off(document, 'mousedown.focus', e => (this.focusTarget = null))
  }

  static enter (target, nativeEvent) {
    let dispatcher = cached.get(target.root)

    if (dispatcher) {
      let enter = target[area]

      if (target !== dispatcher.enterTarget) {
        enter || $object.unenumerable(target, area, enter = {})

        if (target === target.root) {
          clearArea(dispatcher.enterTarget)
          dispatcher.enterTarget = null
        }

        enter.prev = dispatcher.enterTarget

        dispatcher.enterTarget = target
        dispatcher.dispatch('mouseenter', nativeEvent)
      }
    }
  }

  static drag (target) {
    let dispatcher = cached.get(target.root)

    dispatcher.dragTarget = target
  }

  static leave (target, nativeEvent) {
    let dispatcher = cached.get(target.root)

    if (dispatcher) {
      let tail = dispatcher.enterTarget

      dispatcher.leaveTarget = target

      if (target === target.root) {
        clearArea(tail)
        dispatcher.enterTarget = tail
        return
      }

      if (tail) {
        if (tail === target) {
          dispatcher.enterTarget = tail[area].prev
          tail[area].prev = null
        } else {
          // walk
          let next = tail
          while ((tail = tail[area].prev) && tail !== target) {
            next = tail
          }

          tail && (next[area].prev = tail[area].prev)
        }
      }

      dispatcher.dispatch('mouseleave', nativeEvent)
    }
  }

  constructor (display) {
    this.display = display
    this.mouseState = MouseState.none

    this.focusTarget = null
    this.dragTarget = null
    this.leaveTarget = null
    this.enterTarget = null

    this.accessible = true

    this.lastLocation = [NaN, NaN]
    this.scale = [1, 1]
  }

  dispatch (eventName, event) {
    if (this.accessible && dispatchEvent[eventName]) {
      dispatch(this, eventName, event)
    }
  }

  notify (name, widget, event) {
    if (widget) {
      let location = $window.location(this.display.el, event)
      let over = this.enterTarget
      if (over && over === this.dragTarget) {
        over = this.enterTarget[area].prev
      }

      let $event = Event.of(
          name,
        {
          x: Math.round(10 * location.x / this.scale[0]) / 10,
          y: Math.round(10 * location.y / this.scale[1]) / 10,
          nativeEvent: event,
          drag: this.dragTarget,
          on: this.enterTarget,
          over,
          focus: this.focusTarget,
          walkArea: walkArea // TODO
        }
      )

      widget.emit(name, $event)
    }
  }
}

export default EventDispatcher
