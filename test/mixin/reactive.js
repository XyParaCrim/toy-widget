import {$array, $fn} from '../../src/util'
import Reactive from '../../src/mixin/reactive'
import Base from '../../src/common/base'
import object from "../../src/util/object";

describe('about language feature', () => {
  const target = {}

  test('a key\'s descriptor is undefined when its undefined', () => {
    expect(Reflect.getOwnPropertyDescriptor(target, 'test')).toBeUndefined()
  })

  test('not use the descriptor object that defined', () => {
    const descriptorOfKey = {
      get: $fn.noop,
      set: $fn.noop
    }

    Reflect.defineProperty(target, 'key', descriptorOfKey)

    expect(target.key).toBeUndefined()
    expect(Reflect.getOwnPropertyDescriptor(target, 'key')).not.toBe(descriptorOfKey)
    expect(Reflect.getOwnPropertyDescriptor(target, 'key')).not.toBe(Reflect.getOwnPropertyDescriptor(target, 'key'))
  })

  test('data descriptor', () => {
    target.data = expect.anything()

    const descriptorOfData = Reflect.getOwnPropertyDescriptor(target, 'data')

    // big pre-condition
    expect(Object.keys(descriptorOfData).length).toBe(4)

    expect(descriptorOfData).toHaveProperty('configurable')
    expect(descriptorOfData).toHaveProperty('enumerable')
    expect(descriptorOfData).toHaveProperty('value')
    expect(descriptorOfData).toHaveProperty('writable')

    // default value
    expect(descriptorOfData).toEqual({
      configurable: true,
      enumerable: true,
      value: target.data,
      writable: true
    })
  })

  test('access descriptor', () => {
    Reflect.defineProperty(target, 'access', {
      get: $fn.noop
    })

    const descriptorOfAccess = Reflect.getOwnPropertyDescriptor(target, 'access')

    // big pre-condition
    expect(Object.keys(descriptorOfAccess).length).toBe(4)

    expect(descriptorOfAccess).toHaveProperty('configurable')
    expect(descriptorOfAccess).toHaveProperty('enumerable')
    expect(descriptorOfAccess).toHaveProperty('get')
    expect(descriptorOfAccess).toHaveProperty('set')

    // default value
    expect(descriptorOfAccess).toEqual({
      configurable: false,
      enumerable: false,
      get: $fn.noop,
      set: undefined
    })

    test('array object', () => {
    })
  })

  test('default value on defineProperty fn', () => {
    const descriptorOfOnlyGetter = {
      get: $fn.noop
    }

    Reflect.defineProperty(target, 'OnlyGetter', descriptorOfOnlyGetter)
    expect(Reflect.getOwnPropertyDescriptor(target, 'OnlyGetter')).toStrictEqual({
      configurable: false,
      enumerable: false,
      get: $fn.noop,
      set: undefined
    })
  })

  test('empty descriptor on defineProperty fn', () => {
    const descriptorOfOnlySamePart = {}
    Reflect.defineProperty(target, 'Only', descriptorOfOnlySamePart)

    // data descriptor in default case
    expect(Reflect.getOwnPropertyDescriptor(target, 'Only')).toStrictEqual({
      configurable: false,
      enumerable: false,
      writable: false,
      value: undefined
    })
  })

  test('configurable is false', () => {
    Reflect.defineProperty(target, 'unConfigurable', {configurable: false})

    expect(target).toHaveProperty('unConfigurable', undefined)

    // do configure again when configurable is false
    const reconfiguraValue = expect.anything()
    Reflect.defineProperty(target, 'unConfigurable', {configurable: false, value: reconfiguraValue})

    // useless
    expect(target).toHaveProperty('unConfigurable', undefined)
    expect(reconfiguraValue).not.toBe(undefined)

    // do delete
    Reflect.deleteProperty(target, 'unConfigurable')

    // useless
    expect(target).toHaveProperty('unConfigurable')
  })

  test('special bounds', () => {
    Reflect.defineProperty(target, 'bounds', {
      get: undefined,
      set: undefined
    })

    expect(target.bounds).toBe(undefined)
    expect(() => target.bounds = 1).toThrow()
    expect(Reflect.getOwnPropertyDescriptor(target, 'bounds').get).toBeUndefined()
  })
})

describe('test array fn', () => {
  console.log(Object.keys($array.methods).length)
  console.log(Reflect.getPrototypeOf(Array))
  console.log(Reflect.ownKeys($array.methods))

  test('config index item', () => {
    const array = Array.of(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    const reactiveFn = jest.fn((fnName, id) => `${fnName} of ${id}`)

    function letArrayReactive (array, index) {
      const descriptor = Reflect.getOwnPropertyDescriptor(array, index)

      let value = descriptor.value

      Reflect.defineProperty(array, index, {
        get () {
          console.log(reactiveFn('getter', index))
          return value
        },
        set (newValue) {
          console.log(reactiveFn('setter', index))
          value = newValue
        }
      })
    }

    for (let index of array.keys()) letArrayReactive(array, index)

    // $array.remove(array, 10)
    array.splice(10, 1)
  })
})

describe('reactive', () => {
  const ReactiveCtr = Base.implement(Reactive)
  const instance = new ReactiveCtr()

  test('test api', () => {
    let anyValue = expect.anything()

    instance.define('temp$0', {
      value: anyValue
    })
    expect(instance.temp$0).toBe(anyValue)

    instance.firstName = 'Xy'
    instance.lastName = 'Crime'
    instance.define('name', {
      get () {
        return `${this.firstName} ${this.lastName}`
      },
      set (value) {
        let split = value.toString().split(' ')
        instance.firstName = split[0]
        instance.lastName = split[1]
      }
    })

    expect(instance.name).toBe('Xy Crime')

    instance.lastName = 'Para'
    expect(instance.name).toBe('Xy Para')

    instance.handleOfPropertyChanged = function (key, newValue, oldValue) {
      console.log(key, newValue, oldValue)
    }
    instance.name = 'X Y'
  })
})
