import {$array} from "../../../../util";

export default function selectionFeature() {
  function clearSelection (widget) {
    for (let selection of widget.selection) {
      selection.setSelected(false)
    }

    widget.selection.length = 0
  }


  return {
    name: 'selection',

    mixin: {
      setSelection (newSelection) {
        let selection = this.selection || (this.selection = Array.of())
        let oldSelection = $array.copy(selection)

        if (newSelection) {
          newSelection = [].concat(newSelection)

          if ($array.isDiff(selection, newSelection)) {
            clearSelection(this)
            selection = this.selection = newSelection

            let mulitple = selection.length > 1
            for (let selected of selection) {
              selected.setSelected(true, mulitple)
            }

            this.emit('selection:changed', $array.copy(this.selection = newSelection), oldSelection)
          }
        } else {
          if (selection.length !== 0) {
            clearSelection(this)
            this.emit('selection:changed', $array.copy(selection), oldSelection)
          }
        }
      },
      selecting () {
        return (this.selection || (this.selection = Array.of()).length > 0) && (!this.getSelected().selected)
      },
      selectingSolely () {
        return this.selecting() && this.selection.length === 1
      }
    }
  }
}