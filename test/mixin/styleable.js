import Styleable from '../../src/mixin/styleable'
import {$object} from "../../src/util";
import Base from '../../src/common/base'

const mixinOfStyleable = Styleable()

test('context', () => {

  class Ctr extends Base.implement(mixinOfStyleable) {

    handleOfStyle = jest.fn((key, value) => {
      console.log(key, value)
    })

  }

  const instance = new Ctr()

  instance.style.width = '5px'

  expect(instance.handleOfStyle.mock.calls[0][0]).toBe('width')
  expect(instance.handleOfStyle.mock.calls[0][1]).toBe('5px')
  expect(instance.style.width).toBe('5px')

  instance.style = {
    p1: 1,
    p2: 2,
    p3: 3
  }

  expect(instance.style.p1).toBe(1)
  expect(instance.style.p2).toBe(2)
  expect(instance.style.p3).toBe(3)

  instance.applyStyle()

})

test('Property color', () => {
  const Class = Base.implement(Styleable)

  class Class$1 extends Class {}

  const stylebaleObj = new Class$1()

  /// stylebaleObj.handleOfStyle = function () {}

  stylebaleObj.style = {a: 1}

  // const dis = Reflect.getOwnPropertyDescriptor(stylebaleObj, 'style')
  expect(Reflect.getOwnPropertyDescriptor(stylebaleObj, '_style').enumerable).toBe(false)
})
