import * as $object from '../../src/util/object'

describe('util for object', () => {

  let count = 0

  class A1 {
    defaults = new Map()
  }

  class A2 extends A1 {
    defaults = this.defaults.set(1, ++count)
  }

  test('is', () => {
    let a = new A2()
    let b = new A2()
    let c = new A2()

    expect(count).toBe(3)
    expect($object.is('sdada')).toBeFalsy()
  })
})