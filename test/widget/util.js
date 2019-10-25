import {unmodifiable} from '../../src/weigets/widget/util'
import Widget from '../../src/weigets/widget/widget'

describe('test able after unmodifiable', () => {
  const fakeApi = { of: {} }
  const UnmodifiableWidget = unmodifiable(Widget, fakeApi)

  test('set handler', () => {
    expect(() => {
      UnmodifiableWidget.xx = 1
    }).toThrow(TypeError)
  })

  test('get handler', () => expect(UnmodifiableWidget.of).toBe(fakeApi.of))

  test('apply handler', () => expect(UnmodifiableWidget).toThrow(TypeError))

  test('construct handler', () => {
    expect(new UnmodifiableWidget()).toBeInstanceOf(Widget)
  })
})