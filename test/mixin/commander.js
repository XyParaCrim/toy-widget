import Commander from '../../src/mixin/commander'
import Base from '../../src/common/base'
import {$fn} from '../../src/util'

const mock = jest.fn(message => console.log(message))
const TestCtr = Base.implement(Commander(10)).mix({
  executed (command) {
    mock('executed')
  },

  undone (command) {
    mock('undone')
  },

  redone (command) {
    mock('redone')
  },

  onDirty (value) {
    mock('onDirty')
  },

  errorCapturedOfCommand (error) {
    mock('errorCapturedOfCommand')
  }
})

const instance = new TestCtr()
const command = {
  execute: $fn.noop,
  undo: $fn.noop,
  redo: $fn.noop
}

test('main', () => {
  instance.execute(command)
  instance.undo()
  instance.redo()
  // expect(mock.mock.calls[0][0]).toBe('executed')
})
