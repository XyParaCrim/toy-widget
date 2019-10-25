import Base from '../../src/common/base'

describe('mix', () => {
  test('usage', () => {
    class ChildOfUsage extends Base {}
    ChildOfUsage.mix({ property$0: 'property$0' })

    expect(ChildOfUsage.mix).toBe(Base.mix)
    expect(new ChildOfUsage().property$0).toBe('property$0')
  })

  test('multiple', () => {
    class ChildOfMultiple extends Base {}

    expect(new ChildOfMultiple().a).toBeUndefined()
    expect(new ChildOfMultiple().b).toBeUndefined()

    ChildOfMultiple.mix(
        {a: 1},
        {a: 2, b: 2},
        {a: 3, b: 3, c: 3}
    )
    expect(new ChildOfMultiple().a).toBe(3)
    expect(new ChildOfMultiple().b).toBe(3)
    expect(new ChildOfMultiple().c).toBe(3)
  })

  test('polltion', () => {
    class ChildOfPollution extends Base {
      compute () {
        return 1
      }
    }

    expect(new ChildOfPollution().compute()).toBe(1)

    class Pollted extends ChildOfPollution.mix({compute () { return 2 }}) {
      compute () {
        return super.compute() + 1
      }
    }

    expect(new Pollted().compute()).toBe(3)
    expect(new ChildOfPollution().compute()).not.toBe(1)
  })

  test('thick', () => {
    const computable = {
      compute () {
        return 1
      }
    }
    class ChildOfThick extends Base.implement(computable) {
      compute () {
        return super.compute() - 1
      }
    }

    expect(new ChildOfThick().compute()).toBe(0)
    expect(() => new Base().compute()).toThrow()
  })


  test('super', () => {
    class XX extends Base {
      method () {
        return 'method.xx'
      }
    }

    const ExtendXX = XX.implement({
      method () {
        expect(super.method()).toBe('method.xx')
      }
    })

    new ExtendXX()
  })

  test('匿名继承', () => {

    class Name1 {
      name1 () {
        return 'name1'
      }

      name3 () {

      }
    }

    class Name2 extends Name1 {
      name2 () {}

      name1 () {
        return super.name1()
      }
    }

    const prototype = {
      Object: Object.prototype,
      Function: Function.prototype,
      classes: Name1.prototype
    }

    const __proto__ = {
      Function: Reflect.getPrototypeOf(Function),
      Function$__proto__: Reflect.getPrototypeOf(Reflect.getPrototypeOf(Function)),
      classes: Reflect.getPrototypeOf(Name1)
    }

    expect(__proto__.Function).toBe(prototype.Function)
    expect(__proto__.Function$__proto__).toBe(prototype.Object)
    expect(__proto__.classes).toBe(prototype.Function)

    expect(Reflect.getPrototypeOf(Name2.prototype)).toBe(Name1.prototype)

    class Name3 {
      name1 () {
        return super.name1() + 'name3'
      }
    }

    expect(Reflect.setPrototypeOf(Name3.prototype, Name1.prototype)).toBe(true)


    let name2 = new Name2()
    expect(name2.name1()).toBe('name1')
    expect(new Name3().name1()).toBe('name1name3')

    let NN = function () {}

    Reflect.setPrototypeOf(NN.prototype, Name1.prototype)

    Reflect.defineProperty(NN, 'name', {
      value: 'name4',
      writable: false,
      enumerable: false,
      configurable: true
    })
    let nn = new NN()

    expect(Name1.name).toBe('Name1')

    function Wrapper () {
      console.log('wrapper')
    }

    Wrapper.prototype.constructor = function () { console.log('inter') }

    new Wrapper()
  })

  test('new base', () => {
    class Base2 extends Base {
      aa () {}
    }

    const Base1 = Base.implement({className: 'base1'})

    expect(Base1.name).toBe('Base')
  })
})
