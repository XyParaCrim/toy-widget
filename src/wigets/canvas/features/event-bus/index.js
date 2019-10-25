import EventBus from "./event-bus";

export default function eventBusFeature() {
  return {
    name: 'event-bus',

    defaults: {
      on: {
        create() {
          this.eventBus = new EventBus(this)
        },
        dispose() {
          this.eventBus.dispose()
        }
      }
    }
  }
}