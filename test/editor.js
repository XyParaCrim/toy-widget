// import EditPart from '../src/core/editpart/edit-part'
import Editor from '../demo/flow-editor'

describe('property visible', () => {

  test('styleable', () => {
    // const editPart = new EditPart({})
  })
  test('extend map', () => {
    class ExtendMap extends Map {
      constructor () {
        super()

        expect(this.constructor).toBe(ExtendMap)
      }
    }
  })

})