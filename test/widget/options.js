import OptionsSupport from '../../src/common/options-support'
import {Emitter} from '../../src/mixin/emitter'
import Base from '../../src/common/base'
import {$fn} from '../../src/util'

describe('Options usage', () => {
  const defualts = {
    style: {
      'color': 'red',
      'background': 'red'
    }
  }

  const options = OptionsSupport.of(defualts)

  test('direct reference', () => {
    expect(options.options).toBe(defualts)
  })

  test('merge strategies', () => {
    options.merge({aaa: 1})
    options.merge({style: { color: 'green', 'width': 100 }})

    expect(options.options.aaa).toBeUndefined()
    expect(options.options.style.color).toBe('green')
    expect(options.options.style.width).toBe(100)
    expect(options.options).toBe(defualts)
  })

  test('build strategies', () => {
    const EmitterCtor = Base.implement(Emitter)
    let emitter = new EmitterCtor()

    const firstFn = jest.fn($fn.noop)    // emitter.on('test', firstFn)

    options.merge({ on: { test: firstFn } })
    options.build(emitter)
    emitter.emit('test')

    expect(firstFn.mock.calls.length).toBe(1)

    const secondFn = jest.fn($fn.noop)

    options.merge({
      on: {
        test: secondFn
      }
    })
    options.build(emitter = new EmitterCtor())

    emitter.emit('test')

    expect(options.options.on.test.length).toBe(2)
    expect(firstFn.mock.calls.length).toBe(2)
    expect(secondFn.mock.calls.length).toBe(1)
  })
})
