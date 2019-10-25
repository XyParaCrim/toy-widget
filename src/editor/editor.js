// TODO

class Editor {
  constructor(root) {
    // TODO
    this.root = root
    this.root.editor = this
    this.root.root = this.root
  }

  mount (el) {
    this.root.state.create()

    el.append(this.root.el)

    this.root.state.active()

    return this
  }

  get model () {
    this.root.model
  }

  dispose () {
    this.root.el.parentNode.removeChild(this.root.el)
    this.root.state.dispose()
    this.emit('dispose')
  }
}

export default Editor