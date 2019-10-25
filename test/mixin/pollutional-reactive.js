import Reactor, {symbolOfReactor} from '../../src/mixin/pollutional-reactive'

describe('pollutional-reactive', () => {
  const target = {}

  test('invalid input', () => {
    expect(Reactor.reactive('sdada')).toBeFalsy()
    expect(Reactor.reactive(123)).toBeFalsy()
    expect(Reactor.reactive(null)).toBeFalsy()
    expect(Reactor.reactive(undefined)).toBeFalsy()
  })

  test('dispatcher bond', () => {
    // reactive object
    expect(Reactor.reactive(target)).toBeTruthy()
    expect(target[symbolOfReactor]).not.toBeNull()
  })

  test('observer fn', () => {
    let radix = 2
    let power = 3
    Reactor.observe(target, 'certainKey', {
      get () {
        return Math.pow(radix, power)
      }
    })

    expect(target.certainKey).toBe(8)

    // change
    power = 10
    expect(target.certainKey).toBe(1024)

    Reflect.deleteProperty(target, 'certainKey')
    expect(target.certainKey).toBeUndefined()
  })

  test('depend', () => {
    Reactor.observe(target, 'depend$0', {
      value: 10
    })

    Reactor.observe(target, 'depend$1', {
      value: 11
    })

    Reactor.observe(target, 'output', {
      get () {
        return this.depend$0 + this.depend$1
      }
    })

    expect(target.output).toBe(21)
  })
})
