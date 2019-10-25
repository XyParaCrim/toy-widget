// TODO show usage rate, hit rate
export function cachedOfUnlimited (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    let hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

export function cachedOfLimited (fn, size) {
  const cache = Object.create(null)
  const sequence = Array.of()
  return function cachedFn (str) {
    if (Reflect.has(cache, str)) {
      return cache[str]
    }

    if (sequence.length < size) {
      sequence.push(str)
    } else {
      Reflect.deleteProperty(cache, sequence[0])
      sequence[0] = str
    }

    return (cache[str] = fn(str))
  }
}

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
export function genUUID (len = 32, radix = 16) {
  let uuid = [], i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

export default {
  cachedOfUnlimited,
  cachedOfLimited,
  genUUID
}
