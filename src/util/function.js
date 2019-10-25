export const noop = function () {
}

export const todo = function () {
}

export const requiredHook = function () {
}

export const optionalHook = function () {
}

export function is(fn) {
  return fn instanceof Function
}

export function throwIfNot(fn, message) {
  if (!(fn instanceof Function)) {
    throw new Error(message)
  }
}

export function bindFn(fn, ctx) {
  return function bindedFn() {
    return fn.apply(ctx, arguments)
  }
}

export function truth() {
  return true
}

export function falsely() {
  return false
}

export function construct(Class, extendOption, ...args) {
  if (Reflect.has(Class, 'extend') && typeof Class === 'function') {
    let Construct = Class

    if (typeof extendOption === 'object') {
      if (extendOption instanceof Class) {
        return extendOption
      }

      Construct = Construct.extend(extendOption)
    }

    return Reflect.construct(Construct, args)
  }
  return false
}

function once(fn) {
  const onceFn = function () {
    if (!onceFn.called) {
      onceFn.called = true;
      fn.apply(this, arguments);
    }
  }

  onceFn.called = false

  return onceFn
}

function makeMap(str, expectsLowerCase) {
  let map = Object.create(null)
  let list = str.split(',')
  for (let key of list) {
    map[key] = true
  }
  return expectsLowerCase
    ? function (val) {
      return map[val.toLowerCase()];
    }
    : function (val) {
      return map[val];
    }
}

export default {
  throwIfNot,
  construct,
  bindFn,
  noop,
  requiredHook,
  optionalHook,
  is,
  todo,
  truth,
  falsely,
  once,
  makeMap
}
