export default class Event {
  constructor (event, props) {
    this.type = event
    Object.assign(this, props)
  }

  static of (name, props) {
    if (name === 'keyup' || name === 'keydown') {
      return new KeyEvent(name, props)
    }

    return new Event(name, props)
  }

/*    static ofMousedown (target, event, props) {
        const location = $window.location(target.el)

        return new Event('mousedowm', location, props)
    }

    static ofMouseup (target, event, props) {
        const location = $window.location(target.el)

        return new Event('mousedowm', location, props)
    } */
}

class KeyEvent extends Event {
  constructor (event, props) {
    super(event, props)
    this.key = this.nativeEvent.key
    this.keyCode = this.nativeEvent.keyCode
  }
}
