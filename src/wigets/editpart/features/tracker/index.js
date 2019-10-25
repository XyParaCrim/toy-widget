import Tracker from "./tracker";
import {$fn} from "../../../../util";
import ClassSupport from "../../../../common/class-support";

const nullTracker = new Tracker()

export default function trackerFeature () {
  return {
    name: 'visual',

    options: {
      draggable: {},
      createTracker: {}
    },

    defaults: {
      on: {
        create() {
          let draggable = this.options.get('draggable')
          let createTracker = this.options.get('createTracker')
          let tracker = nullTracker

          if (draggable && $fn.is(createTracker)) {
            let hooks = createTracker()
            let newTracker = new Tracker()
            tracker = ClassSupport.hooks(newTracker, hooks)
          }
          this.tracker = tracker
        },
        active() {
          this.tracker.active(this)
        },
        deactive() {
          this.tracker.deactive()
        },
        dispose() {
          this.visual.dispose()
        }
      }
    }
  }
}