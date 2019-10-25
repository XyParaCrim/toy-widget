import Visual from "../../../editpart/features/visual/visual";

export default function handleVisualFeature () {

  class HandleVisual extends Visual {

    active () {
      for (let name of Object.keys(this.methods)) {
        this.hostTarget.on(`refresh:${name}`, () => this.refresh(name))
      }

      this.refresh()
    }

    deactive () {
      for (let name of Object.keys(this.methods)) {
        this.hostTarget.off(`refresh:${name}`, () => this.refresh(name))
      }
    }
  }

  return {
    name: 'handle-visual',

    defaults: {
      on: {
        create() {
          this.visual = new HandleVisual(this, this.host)
        },

        active() {
          this.visual.active()
        },

        deactive() {
          this.visual.deactive()
        }
      }
    }
  }
}