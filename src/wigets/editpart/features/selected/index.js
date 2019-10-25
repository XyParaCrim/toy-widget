import {$object} from "../../../../util";

export default function selectedFeature() {
  return {
    name: 'selected',

    mixin: {
      setSelected (selected, mulitple = false) {
        const selectState = this.getSelected()

        selectState.selected = selected
        selectState.mulitple = mulitple

        this.emit('selected:changed', $object.copy(selectState))
      },
      getSelected () {
        return this.selectState || (this.selectState = {selected: false, mulitple: false})
      }
    }
  }
}