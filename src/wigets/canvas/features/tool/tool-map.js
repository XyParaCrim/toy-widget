import BaseTool from "./base-tool";
import {$object, $string} from "../../../../util";

const Null = {
  activate () {

  },
  deactivate () {

  }
}

class ToolMap extends Map {
  constructor (editPart) {
    super()

    this.editPart = editPart
    this.set('default', Null)
  }

  set (key, toolOptions) {
    super.set(key, BaseTool.create(toolOptions))
  }

  active (toolName, request) {
    if (arguments.length === 0) {
      toolName = 'default'
    } else if (!$string.is(toolName)) {
      request = toolName
      toolName = 'default'
    }

    const tool = this.get(toolName)
    if ($object.notEqual(tool, this.activeTool)) {
      this.deactive()

      this.activeTool = tool
      this.activeTool.editor = this.editPart.editor
      this.activeTool.activate(request)
    }
  }

  deactive () {
    if (this.activeTool) {
      this.activeTool.deactivate()
      this.activeTool.editor = null
    }
  }

  clear () {
    super.clear()
    this.editPart = null
  }
}

export default ToolMap