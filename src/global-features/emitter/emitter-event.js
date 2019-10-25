class EmitterEvent {
  constructor(name, callback, context) {
    this.name = name
    this.callback = callback
    this.context = context
  }

  invoke(args) {
    try {
      this.callback.apply(this.context, args)
    } catch (e) {
      console.error(this.detail(), e)
    }
  }

  equals(callback, context) {
    return callback === this.callback && context === this.context
  }

  detail() {
    return `[Failed event - ${this.name}]: `
  }
}

export default EmitterEvent