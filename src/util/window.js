const listenPool = new WeakMap()
/**
 * @param type String 'eventType.nameSpace'
 * @param options {useCapture: true} 捕捉阶段执行，
 *                {default: false} 不阻止默认行为
 *                {stop: false} 不阻止事件传播
 */
export function on (element, type, handle, options = {stop: false}) {
  let _handle

  if (options.default !== false && options.stop !== false) {
    _handle = e => {
      handle(e)
      e.stopPropagation()
      e.preventDefault()
    }
  } else if (options.default !== false) {
    _handle = e => {
      handle(e)
      e.preventDefault()
    }
  } else if (options.stop !== false) {
    _handle = e => {
      handle(e)
      e.stopPropagation()
    }
  } else {
    _handle = handle
  }

  const split = type.split('.')
  const eventType = split[0]
  const namespace = split[1] || ''
  const useCapture = options.useCapture === true

  element.addEventListener(eventType, _handle, useCapture)

  // for remove
  let cache = listenPool.has(element) ? listenPool.get(element) : new Map()

  if (!cache.has(namespace)) {
    cache.set(namespace, Array.of([eventType, _handle, useCapture]))
  } else {
    cache.get(namespace).push([eventType, _handle, useCapture])
  }
  listenPool.set(element, cache)
}

export function off (element, type = '*.*') {
  const cache = listenPool.get(element)

  if (cache != null) {
    const split = type.split('.')
    const eventType = split[0]
    const namespace = split[1] || ''

    let entires

    if (namespace === '*') {
      entires = cache.entries()
    } else {
      if (!cache.has(namespace)) {
        return
      }

      entires = [[namespace, cache.get(namespace)]]
    }

    const isAll = eventType === '*'
    entires.forEach(([ns, arr]) => {
      let newCache = []
      if (!isAll) {
        arr.forEach(args => {
          if (args[0] === eventType) {
            Reflect.apply(document.removeEventListener, element, args)
          } else {
            newCache.push(args)
          }
        })
      } else {
        arr.forEach(args => {
          Reflect.apply(document.removeEventListener, element, args)
        })
      }

      if (newCache.length === 0) {
        cache.delete(ns)
      }
    })

    if (cache.size === 0) listenPool.delete(element)
  }
}

export function createElement (widget, tagName) {
  let e = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  if (widget) {
    widget.style = e.style
  }
  return e
}

/* let _textHeight
export function fontHeight (svg) {
  if (_textHeight !== undefined) return _textHeight

  const text = createElement(null, 'text')
  text.innerHTML = 'FLOW'
  Util.applyAttr(text, {x: -100, y: -100})
  svg.appendChild(text)

  const box = text.getBBox()
  _textHeight = 2 * (-100) - 2 * box.y - box.height
  svg.removeChild(text)

  return _textHeight
} */

function offset (elem) {
  if (!elem.getClientRects().length) {
    return { top: 0, left: 0 }
  }

  // Get document-relative position by adding viewport scroll to viewport-relative gBCR
  let rect = elem.getBoundingClientRect()
  let win = elem.ownerDocument.defaultView
  return {
    top: rect.top + win.pageYOffset - elem.scrollTop,
    left: rect.left + win.pageXOffset - elem.scrollLeft
  }
}

function location (el, event) {
  let {top, left} = offset(el)

  return {
    x: Reflect.has(event, 'clientX') ? event.clientX - left : left,
    y: Reflect.has(event, 'clientY') ? event.clientY - top : top
  }
}

function style (el, key, value) {
  if (arguments.length === 2) {
    for (let styleKey in key) {
      Reflect.set(el.style, styleKey, key[styleKey])
    }
  } else {
    Reflect.set(el.style, key, value)
  }
}

function attr (el, key, value) {
  if (arguments.length === 2) {
    for (let attrKey in key) {
      el.setAttribute(attrKey, key[attrKey])
    }
  } else {
    el.setAttribute(key, value)
  }
}

function classes (el, classes) {
  if (classes) {
    classes = classes.split(' ')
    classes.forEach(className => el.classList.add(className))
  }
}

function isElement (el) {
  return el instanceof Element
}

function doAppendChild (parent, child) {
  isElement(parent) && parent.appendChild(child)
}

function keyStr (event) {
  let key = ''

  if (event.altKey)
    key += 'alt+'
  if (event.ctrlKey)
    key += 'ctrl+'
  if (event.shiftKey)
    key += 'shift+'

  key += event.key.toLowerCase()

  return key
}

export default {
  style,
  attr,
  classes,
  location,
  // fontHeight,
  doAppendChild,
  isElement,
  createElement,
  on,
  off,
  offset,
  keyStr
}
