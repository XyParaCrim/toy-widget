import Emitter from '../../src/mixin/emitter'
import Base from '../../src/common/base'

describe('emitter', () => {
  const EmitterCtr = Base.implement(Emitter)
  const instance = new EmitterCtr()

  test('method exist', () => {
    expect(instance.on).toBe(Emitter.on)
    expect(instance.off).toBe(Emitter.off)
    expect(instance.emit).toBe(Emitter.emit)
  })

  const mock = jest.fn(message => message)
  test('functional', () => {
    instance.on('test', message => {
      mock(message)
    })

    instance.emit('test', 'test message')
    expect(mock.mock.calls.length).toBe(1)
    expect(mock.mock.results[0].value).toBe('test message')

    instance.off('test')
    instance.emit('test', 'test message')
    expect(mock.mock.calls.length).toBe(1)
  })
})
