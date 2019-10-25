import Base from '../../../../common/base'
import {$fn} from '../../../../util'

class BaseTool extends Base {
  static create (options) {
    const ToolCtor = BaseTool.implement(options)

    return new ToolCtor()
  }

  static activte (editor, tool) {

  }

  static deactivete (editor, tool) {

  }
}

BaseTool.mix({
  activate: $fn.optionalHook,
  deactivate: $fn.optionalHook
})

export default BaseTool
