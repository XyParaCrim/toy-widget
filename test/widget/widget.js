import Widget from '../../src/weigets/widget'

describe('test Widget usage', () => {
  test('只能通过new实例化', () => {
    expect(Widget).toThrow(TypeError)
    expect(new Widget()).toBeInstanceOf(Widget)
  })

  test('全局api', () => {
    const Control = Widget.extend({
      onInit () {
        console.log('init')
      },
      onCreate () {
        console.log('create')
      }
    })

    let control = Control.of({})
  })
})
