const methods = Array.prototype

const isArray = Array.isArray

const is = isArray

const empty = Object.freeze(Array.of())

function last (array) {
  return isArray(array) ? array[array.length - 1] : undefined
}

function isEmpty (array) {
  return !array || array.length === 0
}

function insert (array, item, index) {
  array.splice(index, 0, item)
}

function contains (array, obj) {
  return !(array.indexOf(obj) < 0)
}

function remove (array, obj) {
  let index = isArray(array) ? array.indexOf(obj) : -1
  if (!(index < 0)) {
    array.splice(index, 1)
  }
}

function foreachIfPresent (array, fn) {
  is(array) && array.forEach(fn)
}

function ofDequeStack (size) {
  const stack = Array.of()

  stack.$index = size - 1
  stack.$size = size

  stack.$push = function pushOfStack (item) {
    this.$index = (this.$index + 1) % this.$size
    this[this.$index] = item
  }

  stack.$pop = function popOfStack () {
    const item = this.$peek()

    Reflect.deleteProperty(this, this.$index--)
    if (this.$index < 0) {
      this.$index += this.$size
    }

    return item
  }

  stack.$peek = function peekOfStack () {
    const item = this[this.$index]
    if (item === undefined) {
      throw Error('stack is empty')
    }

    return item
  }

  stack.$isEmpty = function isEmptyOfStack () {
    return this[this.$index] === undefined
  }

  stack.$clear = function clearOfStack () {
    this.length = 0
  }

  return stack
}

function ofLimitedBag (limit, initArray) {
  const bag = Array.of()

  bag.$limit = limit

  bag.$push = function (item) {
    this.push(item)
    this.length > this.$limit && this.shift()
  }

  isArray(initArray) && initArray.forEach(item => bag.$push(item))

  return bag
}

function makeArrayMap () {
  const map = new Map()

  map.$push = function pushOfArrayMap (key, value) {
    let array = this.get(key) || Array.of()

    array.push(value)
    this.set(key, array)
  }

  map.$delete = function deleteOfArrayMap (key, value) {
    if (this.has(key)) {
      remove(this.get(key), value)
    }
  }

  map.$valuesOf = function valuesOfOfArrayMap (key) {
    return this.get(key) || empty
  }

  map.$certainClear = function certainClearOfArrayMap (key) {
    if (this.has(key)) {
      this.get(key).length = 0
    }
  }

  map.$foreachIfPresent = function foreachIfPresentOfArrayMap (key, fn) {
    if (this.has(key)) {
      this.get(key).forEach(fn)
    }
  }

  map.$clear = function clearOfArrayMap() {
    this.clear()
  }

  return map
}

function copy (array) {
  return Array.from(array)
}

function diff (array, another) {
  return array.filter(item => another.indexOf(item) < 0)
}

function isDiff (array, another) {
  if (is(another) && is(array)) {
    if (array === another) {
      return false
    }

    if (array.length === another.length) {
      for (let index in array) {
        if (array[index] !== another[index]) {
          return true
        }
      }

      return false
    }
  }

  return true
}

function indexOfSorted (array, value, compareFn) {
  let high, low, mid

  low = 0
  high = array.length - 1

  if (high < 0) {
    return 0
  }

  while (low <= high) {
    mid = ~~((high + low) / 2)

    if (compareFn(array[mid], value)) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return low
}

function append (prev, next) {
  methods.push.apply(prev, next)
}

export default {
  is,
  isDiff,
  isArray,
  empty,
  copy,
  diff,
  remove,
  last,
  isEmpty,
  methods,
  insert,
  contains,
  ofDequeStack,
  ofLimitedBag,
  makeArrayMap,
  indexOfSorted,
  foreachIfPresent,
  append
}
