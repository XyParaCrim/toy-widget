import Control from '../../plugins/svg/packages/control'

describe('Control usage', () => {

  test('control lifecycle', () => {
    const control = new Control({
      on: {
        init () {
          expect(control).toBe(arguments[0])
        }
      }
    })
  })
})