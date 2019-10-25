import {cachedOfUnlimited} from './shared'

export function is (value) {
  return typeof value === 'string'
}

export function throwIfNot(value, message) {
  if (!is(value)) {
    throw new Error(message)
  }
}

export const toKeyString = cachedOfUnlimited(function (key = '') {
  return key.toLowerCase().split('+').sort().join('+')
})

export function toKeyStringByEvent (e) {
  const keys = []

  if (e.altKey) { keys.push('alt') }
  if (e.ctrlKey) { keys.push('ctrl') }
  if (e.shiftKey) { keys.push('shift') }
  keys.push(e.key.toLowerCase())

  return keys.sort().join('+')
}

export default {
  is,
  throwIfNot,
  toKeyString,
  toKeyStringByEvent
}
