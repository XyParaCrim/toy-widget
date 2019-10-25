import {$object} from '../util'

const symbol = Symbol('composited-marker')

export default class CompositedMarker {
  static marke (model, key, type) {
    const marker = new CompositedMarker(key, type)
    $object.markObject(model, symbol, marker)

    return marker
  }

  static getOrMarke (model, key, type) {
    if (this.isMarked(model)) {
      let marker = this.get(model)

      marker.key = key
      marker.type = type

      return marker
    }

    return this.marke(model, key, type)
  }

  static isMarked (model) {
    return model[symbol] != null
  }

  static keyOf (model) {
    return model[symbol].key
  }

  static typeOf (model) {
    return model[symbol].type
  }

  static get (model) {
    return model[symbol]
  }

  constructor (key, type) {
    this.key = key
    this.type = type

    this.free = true
    this.newly = false
    this.dying = true
    this.stored = false
    this.valid = false
  }
}
