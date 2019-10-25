import Platform from "../../../../common/platform";

export default function displayElementFeature () {
  return {
    name: 'display-element',

    defaults: {
      on: {
        active() {
          Platform.addDisplayEle(this)
        },
        deactive() {
          Platform.removeDisplayEle(this)
        }
      }
    }
  }

}