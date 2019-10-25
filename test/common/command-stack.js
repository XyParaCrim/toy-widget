import Stack from '../../src/global-features/commander/command-stack'

test('error input', () => {
  expect(() => new Stack(-1)).toThrow()
  expect(() => new Stack(0)).toThrow()
})

describe('main', () => {
  const stack = new Stack(10)

  test('null command', () => {
    return stack.execute().catch(e => {
      expect(e).toBeInstanceOf(Error)
      expect(stack.isDirty()).toBeTruthy()
    })
  })

  const mock = jest.fn((id, hook) => {
    const message = `${hook}:${id}`
    console.log(message)
    return message
  })

  let countOfExecute = 0
  let countOfUndo = 0
  let countOfRedo = 0

  let id = 0
  function createCommand () {
    return {
      id: id++,
      execute () {
        mock(this.id, 'execute')
      },
      undo () {
        mock(this.id, 'undo')
      },
      redo () {
        mock(this.id, 'redo')
      }
    }
  }

  test('execute', () => {
    const command = createCommand()
    return stack.execute(command)
      .then(command => {
        countOfExecute++

        expect(command).toBe(command)
        expect(mock.mock.results[0].value).toBe('execute:0')

        stack.redo().then(() => countOfRedo++)

        expect(mock.mock.calls.length).toBe(1)

        stack.undo().then(() => countOfUndo++)
        stack.redo().then(() => countOfRedo++)


        expect(mock.mock.results[1].value).toBe('undo:0')
        expect(mock.mock.results[2].value).toBe('redo:0')
      })
  })

  test('limit', () => {
    let current = id
    for (let i = 0; i < 20; i++) {
      stack.execute(createCommand())
    }
    countOfExecute += 20
    current += 20

    expect(current).toBe(id)
    expect(mock.mock.calls.length).toBe(countOfExecute + countOfUndo + countOfRedo)

    for (let i = 0, last; i < 10; i++) {
      last = mock.mock.calls.length
      stack.undo()
      expect(mock.mock.calls[last][0]).toBe(--current)
      expect(mock.mock.calls[last][1]).toBe('undo')
    }

    // stack is empty
    let countOfCall = mock.mock.calls.length
    stack.undo()

    expect(mock.mock.calls.length).toBe(countOfCall)
  })

})

