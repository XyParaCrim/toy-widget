import Platform from "../../../../common/platform";

export default function displayFeature () {
  return {
    name: 'displayFeature',

    defaults: {
      on: {
        active() {
          Platform.addDisplay(this)
        },
        deactive() {
          Platform.removeDisplay(this)
        }
      }
    }
  }
}