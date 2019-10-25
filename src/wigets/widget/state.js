import {$object} from '../../util'

/**
 *  1: is error
 *  2: is bind
 *  3: is init
 *  4: create or dispose
 *  5: active or deactive
 */
const startValue = 0b0000

function valueOfProperOrNot (isProper, value = startValue) {
  return (value & 0b1110) | ((isProper ? 1 : 0) << 0)
}

function valueOfInitializeOrNot (isInitialized, value = startValue) {
  return (value & 0b1101) | ((isInitialized ? 1 : 0) << 1)
}

function valueOfCreateOrNot (isCreated, value = startValue) {
  return (value & 0b1011) | ((isCreated ? 1 : 0) << 2)
}

function valueOfActiveOrNot (isActiveed, value = startValue) {
  return (value & 0b0111) | ((isActiveed ? 1 : 0) << 3)
}

function valueOfState (isProper, isInitialized, isCreated, isActiveed) {
  let matchValue = valueOfProperOrNot(isProper)

  if (!isProper) return matchValue
  matchValue = valueOfInitializeOrNot(isInitialized, matchValue)

  if (!isInitialized) return matchValue
  matchValue = valueOfCreateOrNot(isCreated, matchValue)

  if (!isCreated) return matchValue

  return valueOfActiveOrNot(isActiveed, matchValue)
}

function isOn (value, matchValue) {
  return (value & matchValue) === matchValue
}

function hookName (hook) {
  return `on${hook.replace(/( |^)[a-z]/g, l => l.toUpperCase())}`
}

function callLifeHook (hook, emitter, state) {
  const handle = emitter[hookName(hook)]
  let error

  if (handle) {
    state.hooking = true
    try {
      handle.apply(emitter)
    } catch (e) {
      console.error(`lifecycle hook of widget object is failed: ${hook}`)
      console.error(error = e)
    } finally {
      state.hooking = false
    }
  }

  return error == null
}

class State {
  constructor (emitter) {
    let isProper = $object.nonNull(emitter)

    this.value = valueOfProperOrNot(isProper)
    if (!isProper) {
      throw new TypeError()
    }

    this.emitter = emitter
    this.hooking = false
  }

  init () {
    if (this.initialized) return

    this.value = callLifeHook('init', this.emitter, this)
        ? valueOfInitializeOrNot(true, this.value)
        : valueOfProperOrNot(false, this.value)

    this.initialized && this.emitter.emit('init')
  }

  create () {
    if (this.proper && !this.created) {
      this.value = callLifeHook('create', this.emitter, this)
          ? valueOfCreateOrNot(true, this.value)
          : valueOfProperOrNot(false, this.value)

      this.created && this.emitter.emit('create')
    }
  }

  active () {
    this.create()

    if (this.proper && !this.actived) {
      this.value = callLifeHook('active', this.emitter, this)
          ? valueOfActiveOrNot(true, this.value)
          : valueOfProperOrNot(false, this.value)

      this.actived && this.emitter.emit('active')
    }
  }

  deactive () {
    if (this.proper && this.actived) {
      this.emitter.emit('deactive')

      this.value = callLifeHook('deactive', this.emitter, this)
          ? valueOfActiveOrNot(false, this.value)
          : valueOfProperOrNot(false, this.value)
    }
  }

  dispose () {
    this.deactive()

    if (this.created) {
      this.emitter.emit('dispose')

      this.value = callLifeHook('dispose', this.emitter, this)
          ? valueOfCreateOrNot(false, this.value)
          : valueOfProperOrNot(false, this.value)
    }
  }

  get proper () {
    return isOn(this.value, valueOfState(true))
  }

  get initialized () {
    return isOn(this.value, valueOfState(true, true))
  }

  get created () {
    return isOn(this.value, valueOfState(true, true, true))
  }

  get actived () {
    return isOn(this.value, valueOfState(true, true, true, true))
  }

  get initializing () {
    return this.hooking && !this.initialized
  }

  get creating () {
    return this.hooking && this.initialized && !this.created
  }

  get activing () {
    return this.hooking && this.created && !this.actived
  }
}

export default State
