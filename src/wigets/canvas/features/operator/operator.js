import {$object, $string} from "../../../../util";

function runOnKey (e) {
  this.check() && this.run()
}

class Operation {
  static create (option, display) {
    let operation = new Operation(display)

    $object.loopIfObject(option, (optionName, option) => (operation[optionName] = option))

    return operation
  }

  static active (operation, display) {
    if ($string.is(operation.key)) {
      display.on(`keydown:${operation.key}`, runOnKey, operation)
    }
  }

  static deactive (operation, display) {
    if ($string.is(operation.key)) {
      display.off(`keydown:${operation.key}`, runOnKey, operation)
    }
  }

  check () {
    return true
  }

  constructor (display) {
    this.root = display
  }

  get editor () {
    return this.root.editor
  }
}

class Operator {
  constructor (display) {
    this.display = display
    this.store = Array.of()
  }

  add (option) {
    let operation = Operation.create(option, this.display)

    operation && this.store.push(operation)
  }

  filter (fn) {
    return this.store.filter(fn)
  }

  getNamed () {
    return this.filter(operation => $string.is(operation.name))
  }

  getNamedWithCheck () {
    return this.filter(operation => $string.is(operation.name) && operation.check())
  }

  active () {
    this.store.forEach(operation => Operation.active(operation, this.display))
  }

  deactive () {
    this.store.forEach(operation => Operation.deactive(operation, this.display))
  }

  dispose () {
    this.store.length = 0
    this.display = null
  }
}

export default Operator