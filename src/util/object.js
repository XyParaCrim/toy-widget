export const empty = Object.freeze({})

export function is (value) {
  return !!value && (typeof value === 'object' || typeof value === 'function')
}

export function isUndefined (obj) {
  return obj === undefined
}

export function isNull (val) {
  return val == null
}

export function nonNull (val) {
  return val != null
}

export function throwIfNull (val, message) {
  if (isNull(val)) {
    throw new Error(message)
  }
}

export function defaultIfNull (val, defaultValue) {
  return val == null ? defaultValue : val
}

export function remove () {

}

export function applyAttr (container, a, v) {
  if (a != null && typeof (a) === 'object') {
    for (let k in a) {
      if (!(container.getAttribute(k) === a[k])) { container.setAttribute(k, a[k]) }
    }
  } else if (typeof (a) === 'string') {
    if (!(container.getAttribute(a) === v)) { container.setAttribute(a, v) }
  }
}

export function apply (container, a, v) {
  if (a != null && typeof (a) === 'object') {
    for (let k in a) {
      container[k] = a[k]
    }
  } else if (typeof (a) === 'string') {
    container[a] = v
  }
}

export function assignPrototype (source) {
  if (!(typeof source === 'function')) {
    return source
  }

  let target
  let clone = source.prototype
  for (let i = 1; i < arguments.length; i++) {
    target = arguments[i]

    if (target == null) {
      continue
    }

    for (let key of Reflect.ownKeys(target)) {
      if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
        Reflect.defineProperty(clone, key, Reflect.getOwnPropertyDescriptor(target, key))
      }
    }
  }
  return source
}

export function unenumerable (obj, key, value) {
  Reflect.defineProperty(obj, key, {
    value: value,
    enumerable: false,
    configurable: true,
    writable: true
  })

  return obj
}

export function ifPresent (obj, fn) {
  is(obj) && fn(obj)
}

export function propertyIfPresent (obj, key, fn) {
  Reflect.has(obj, key) && fn(obj[key])
}

export function loop (object, fn) {
  for (let [key, value] of Object.entries(object)) {
    fn(key, value)
  }
}

export function loopIfObject (object, fn) {
  is(object) && loop(object, fn)
}

export function loopSymbols (object, fn) {
  for (let key of Object.getOwnPropertySymbols(object)) {
    fn(key, object[key])
  }
}

export function loopOwnKeys (object, fn) {
  for (let key of Reflect.ownKeys(object)) {
    fn(key, object[key])
  }
}

export function notEqual (target, source) {
  return target !== source
}

export function equal (target, source) {
  return target === source
}

export function equalWithValue (target, source) {
  for (let key in target) {
    if (target[key] !== source[key]) {
      return false
    }
  }

  return true
}

export function instanceOf (instance, Ctr) {
  return instance instanceof Ctr
}

export function deepCopy (obj) {
  let result = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key]!==null) {
        result[key] = deepCopy(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

export function copy (obj) {
  return Object.assign({}, obj)
}

export function get (obj, keys) {
  let value = obj

  for (let key of keys) {
    value = Reflect.get(value, key)
  }

  return value
}

export function getOrDefault (obj, key, defaultValue) {
  return Reflect.has(obj, key) ? obj[key] : defaultValue
}

export function set (obj, keys, value) {
  let i = 0
  for (; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
  }

  let oldValue = obj[keys[i]]
  obj[keys[i]] = value

  return oldValue
}

function markObject (object, key, value) {
  Reflect.defineProperty(object, key, {
    value: value,
    enumerable: false,
    configurable: true,
    writable: false
  })
}

function size (object) {
  return Object.entries(object).length
}

export default {
  set,
  get,
  getOrDefault,
  copy,
  size,
  empty,
  is,
  isNull,
  isUndefined,
  nonNull,
  throwIfNull,
  defaultIfNull,
  remove,
  applyAttr,
  apply,
  loop,
  loopSymbols,
  loopOwnKeys,
  loopIfObject,
  unenumerable,
  assignPrototype,
  equal,
  equalWithValue,
  notEqual,
  instanceOf,
  deepCopy,
  ifPresent,
  propertyIfPresent,
  markObject
}
