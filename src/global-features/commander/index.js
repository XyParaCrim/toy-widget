import {$fn} from "../../util";
import CommandStack from "./command-stack";

export default function commanderFeature(size) {
  const mixin = {}

  mixin.executed = $fn.optionalHook

  mixin.undone = $fn.optionalHook

  mixin.redone = $fn.optionalHook

  mixin.onDirty = $fn.optionalHook

  mixin.errorCapturedOfCommand = function (e) {
    throw e
  }

  mixin._commandStack = new CommandStack(size)

  mixin.execute = function executeOfCommander (command) {
    let stack = this._commandStack
    let dirty = !stack.isDirty()

    stack.execute(command)
      .then(command => {
        dirty && this.onDirty(dirty)

        this.executed(command)
      })
      .catch(error => this.errorCapturedOfCommand(error, command))
  }

  mixin.undo = function undoOfCommander () {
    let stack = this._commandStack
    let expect = !stack.isDirty()

    stack.undo()
      .then(command => {
        if (command) {
          (expect === stack.isDirty()) && this.onDirty(expect)

          this.undone(command)
        }
      })
      .catch(error => {
        this.errorCapturedOfCommand(error)
      })
  }

  mixin.redo = function redoOfCommander () {
    let stack = this._commandStack
    let expect = !stack.isDirty()

    stack.redo()
      .then(command => {
        if (command) {
          (expect === stack.isDirty()) && this.onDirty(expect)

          this.redone(command)
        }
      })
      .catch(error => {
        this.errorCapturedOfCommand(error)
      })
  }

  Reflect.defineProperty(mixin, 'dirty', {
    get () {
      return this._commandStack.isDirty()
    },
    set: $fn.noop,
    configurable: true,
    enumerable: true
  })

  return { name: 'commander', mixin }
}