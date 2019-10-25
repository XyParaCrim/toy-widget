export const symbol = Symbol('selectable')

const SelectableOptions = {
  $name: symbol,
  activate () {
    const editPart = this.editPart
    const selectable = editPart.options.get('selectable')

    if (selectable) {
      editPart.on('selected:changed', this.selectedChanged, this)

      this.deactivate = function () {
        editPart.off('selected:changed', this.selectedChanged, this)
      }
    }
  },
  selectedChanged (state) {
    if (state.selected && !state.mulitple) {
      this.editPart.el.parentNode.appendChild(this.editPart.el)
    }

    state.selected
        ? this.editPart.emit('selected')
        : this.editPart.emit('unselected')
  }
}

export default function () {
  return SelectableOptions
}
