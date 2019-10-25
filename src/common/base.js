import {$object} from '../util'

export default class Base {
  static mix () {
    if (arguments.length === 0) return this
    if (arguments.length === 1) return $object.assignPrototype(this, arguments[0])
    if (arguments.length === 2) return $object.assignPrototype(this, arguments[0], arguments[1])
    if (arguments.length === 3) return $object.assignPrototype(this, arguments[0], arguments[1], arguments[2])
    return $object.assignPrototype(this, ...arguments)
  }

  static implement () {
    const Constructor = function () {}

    Reflect.setPrototypeOf(Constructor, this)
    Reflect.defineProperty(Constructor, 'name', {
      value: `${this.name}$`,
      configurable: true,
      writable: false,
      enumerable: false
    })

    Constructor.prototype = Object.create(this.prototype)
    Constructor.prototype.constructor = Constructor
    Constructor.mix.apply(Constructor, arguments)

    return Constructor
  }

  static toString () {
    return this.name
  }
}
