import Widget from '../../src/weigets/widget/widget'
import {instanceOf} from "../../src/util/object";

test('exception handle for widget lifecycle', () => {

  class FakeArray {}

  class ArrayWrapper extends FakeArray {}

  let wrapper = new ArrayWrapper()

  expect(wrapper instanceof ArrayWrapper).toBe(true)

  const widget = new Widget()

  expect(widget.state.initialized).toBe(true)

  widget.state.create()
})
