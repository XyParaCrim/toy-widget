import {$array} from '../../util'

export default class CommandStack {
  constructor (size) {
    if (size < 1) {
      throw TypeError()
    }

    this.undoStack = $array.ofDequeStack(size)
    this.redoStack = $array.ofDequeStack(size)
    this.saveLocation = 0
  }

  execute (command) {
    return this._applyCommand(command, 'execute')
      .then(() => {
        this._updateOfExecuted(command)
        return command
      })
  }

  undo () {
    if (!this.undoStack.$isEmpty()) {
      const command = this.undoStack.$pop()

      return this._applyCommand(command, 'undo')
        .then(() => {
          this._updateOfUndone(command)
          return command
        })
    } else {
      return Promise.resolve()
    }
  }

  redo () {
    if (this.redoStack.$isEmpty()) return Promise.resolve()

    const command = this.redoStack.$pop()

    return this._applyCommand(command, 'redo')
      .then(() => {
        this._updateOfRedone(command)
        return command
      })
  }

  isDirty () {
    return this.saveLocation !== 0
  }

  _applyCommand (command, hookName) {
    let error
    try {
      command[hookName]()
    } catch (e) {
      this.saveLocation = NaN
      error = e
    }

    return error ? Promise.reject(error) : Promise.resolve()
  }

  _updateOfExecuted (command) {
    this.saveLocation += this.redoStack.$isEmpty() ? 1 : NaN

    // clear redo stack
    this.redoStack.$clear()
    this.undoStack.$push(command)
  }

  _updateOfUndone (command) {
    this.saveLocation--

    this.redoStack.$push(command)
  }

  _updateOfRedone (command) {
    this.saveLocation++

    this.undoStack.$push(command)
  }
}
