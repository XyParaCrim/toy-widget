import Visual from "./visual";

export default function visualFeature () {
  return {
    name: 'visual',

    mixin: {
      refresh () {
        this.visual.refresh(...arguments)
        this.children.refresh()
      }
    },

    options: {
      visual: {
        merge: 'assign'
      }
    },

    defaults: {
      on: {
        create() {
          this.visual = new Visual(this, undefined)
        },

        active() {
          this.visual.refresh()
        },

        dispose() {
          this.visual.dispose()
        }
      }
    }
  }
}