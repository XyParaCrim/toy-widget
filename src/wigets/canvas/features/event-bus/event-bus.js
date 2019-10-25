class EventBus {
  constructor (editPart) {
    this.editPart = editPart
  }

  invoke (me, editPart, dragTracker, method) {
    return dragTracker && dragTracker[method] != null &&
      dragTracker[method](me, editPart)
  }

  invokeLoop (me, editPart, method) {
    let p = editPart
    while (p != null && !this.invoke(me, p, p.tracker, method) && p.parent != null) {
      p = p.parent
    }
  }

  getActiveTool () {
    return this.editPart.root.tool.activeTool
  }

  bubble (eventName, event, editPart) {
    if (!this.invoke(event, editPart, this.getActiveTool(), eventName)) { this.invokeLoop(event, editPart, eventName) }
  }

  noBubble (eventName, event, editPart) {
    this.invoke(event, editPart, this.getActiveTool(), eventName) === false || this.invoke(event, editPart, editPart.tracker, eventName)
  }

  dispose () {
    this.editPart = null
  }
}

export default EventBus