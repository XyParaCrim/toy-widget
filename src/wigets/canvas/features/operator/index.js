import {$object} from "../../../../util";
import Operator from "./operator";

export default function operatorFeature() {
  return {
    name: 'operator',

    options: {
      operation: {
        merge: 'assign'
      }
    },

    defaults: {
      on: {
        create() {
          const display = this
          const operator = new Operator(display)
          const options = display.options.get('operation')

          $object.loopIfObject(options, (name, option) => operator.add(option))

          this.operator = operator
        },
        active() {
          this.operator.active()
        },
        deactive() {
          this.operator.deactive()
        },
        dispose() {
          this.operator.dispose()
        }
      }
    }

  }
}