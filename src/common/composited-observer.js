import {$fn} from '../util'

function onActived (child) {
  this.observable && child.compositedKey() === this.key && this.onActive(child)
}

function onDeactive (child) {
  this.observable && child.compositedKey() === this.key && this.onDeactive(child)
}

function invokeIfPresent (observer, hook) {
  observer.observable && observer.store.has(observer.key) && hook.call(observer, observer.store.get(observer.key))
}

export default class CompositedObserver {

  constructor (store) {
    this.store = store
    this.observable = false

    this.onActive = $fn.noop
    this.onDeactive = $fn.noop

    store.editPart.on(`${store.eventPrefix}:added`, onActived, this)
    store.editPart.on(`${store.eventPrefix}:removing`, onDeactive, this)
  }

  observe (key) {
    if (key !== this.key) {
      invokeIfPresent(this, this.onDeactive)

      this.key = key
      this.observable = this.key != null && $fn.is(this.onActive) && $fn.is(this.onDeactive)

      invokeIfPresent(this, this.onActive)
    }
  }

  cancel () {
    const store = this.store

    store.editPart.off(`${store.eventPrefix}:added`, onActived, this)
    store.editPart.off(`${store.eventPrefix}:removing`, onDeactive, this)

    invokeIfPresent(this, this.onDeactive)

    this.store = null
  }

  whenActived (handler) {
    this.onActive = handler

    return this
  }

  whenToDeactive (handler) {
    this.onDeactive = handler

    return this
  }

  static create (store) {
    return store ? new CompositedObserver(store) : NullObserver
  }
}

const NullObserver = {
  subscribe: $fn.noop,
  unsubscribe: $fn.noop
}
