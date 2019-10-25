import ToolMap from "./tool-map";
import {$object} from "../../../../util";

export default function toolFeature () {
  return {
    name: 'tool',

    options: {
      tool: {}
    },

    defaults: {
      on: {
        create() {
          let toolMap = new ToolMap(this)
          let options = this.options.get('tool')

          $object.loopIfObject(options, (name, toolOptions) => toolMap.set(name, toolOptions))
          this.tool = toolMap
        },
        active() {
          this.tool.active()
        },
        deactive() {
          this.tool.deactive()
        },
        dispose() {
          this.tool.clear()
        }
      }
    }
  }
}