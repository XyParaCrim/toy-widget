import {$array, $fn, $object} from '../util'
import Widget from '../wigets/widget'
import CompositedMarker from './composited-marker'

function getModelKey (key, model) {
  if (!key) return model

  if ($object.is(model) && model[key] !== undefined) return model[key]

  throw Error('缺少元素的唯一标识')
}

export default class CompositedStore extends Map {
  constructor (editPart, eventPrefix, compositeDescribe) {
    super()
    this.eventPrefix = eventPrefix
    this.editPart = editPart

    this.path = compositeDescribe.path
    this.valid = compositeDescribe.valid || $fn.truth
    this.create = compositeDescribe.create
    this.keyPath = compositeDescribe.key
    this.name = compositeDescribe.name || 'default'

    this.editPart.on(`model:${this.path}`, this.refresh, this)
  }

  dispose () {
    this.editPart.off(`model:${this.path}`, this.refresh, this)
    this.editPart = null
  }

  refresh () {
    let update = this.editPart.get(this.path) || $array.empty

    const identifier = {}

    for (let model of update) {
      let marker
      if (this._tryUpdate(model)) {
        marker = CompositedMarker.get(model)
        marker.newly && this._add(model, marker)
      } else {
        this._add(model, marker = this._newMarker(model))
      }

      marker.id = identifier
    }

    for (let editPart of this.values()) {
      const marker = CompositedMarker.get(editPart.model)

      marker.id === identifier || this._remove(editPart, marker)
    }
  }

  clear () {
    if (this.size > 0) {
      for (let editPart of this.values()) {
        this._remove(editPart, CompositedMarker.get(editPart.model))
      }
    }
  }

  addOrUpdate (modelOrChild) {
    let model, child

    if ($object.instanceOf(model = modelOrChild, Widget)) {
      child = modelOrChild
      model = child.model
    }

    if (!this._tryUpdate(model)) {
      let marker = this._newMarker(model)

      marker.newly = true

      if (child) {
        this.set(marker.key, child)
        marker.stored = true
      }

      this._modifyModelWithAdd(model, marker)
    }
  }

  remove (modelOrChild, dying = true) {
    let model = $object.instanceOf(modelOrChild, Widget) ? modelOrChild.model : modelOrChild

    if (CompositedMarker.isMarked(model)) {
      let marker = CompositedMarker.get(model)

      marker.dying = dying

      return this.has(marker.key) && this._modifyModelWithRemove(model, marker)
    }
  }

  removeWithPrevent (modelOrChild) {
    return this.remove(modelOrChild, false)
  }

  _newMarker (model) {
    let key = getModelKey(this.keyPath, model)
    let type = this.eventPrefix

    return CompositedMarker.getOrMarke(model, key, type)
  }

  _placeholderOfInvalid (model) {
    return { model }
  }

  _tryUpdate (model) {
    if (CompositedMarker.isMarked(model)) {
      const marker = CompositedMarker.get(model)
      if (this.has(marker.key)) {
        marker.free = false
        marker.stored = true

        this._update(marker)

        return true
      }

      if (marker.stored || !marker.free) {
        console.error() // TODO

        return true
      }
    }
    return false
  }

  _update (marker) {
    const child = this.get(marker.key)

    marker.newly && this._add(child.model, marker, child)

    return marker.newly ? (marker.newly = false) : (marker.valid && child.refresh())
  }

  _add (model, marker, child) {
    let parent = this.editPart

    marker.free = false
    marker.valid = this.valid(parent, model)

    if (child == null) {
      child = marker.valid ? this.create(parent, model) : this._placeholderOfInvalid(model)
    }

    this.set(marker.key, child)
    marker.stored = true

    if (marker.valid) {
      parent.composite(this.name, child)
      child.state.actived && parent.emit(`${this.eventPrefix}:added`, child)
    }
  }

  _remove (child, marker) {
    marker.free = true
    if (this.delete(marker.key)) {
      marker.stored = false

      if (marker.valid) {
        this.editPart.emit(`${this.eventPrefix}:remving`, child)

        marker.dying
            ? this.editPart.separate(this.name, child)
            : this.editPart.separateWithPrevent(this.name, child)

        marker.dying = true
      }
    }
  }

  _modifyModelWithAdd (model, marker) {
    this.editPart.modify(this.path, children => {
      children.push(model)

      marker.free = false

      return children
    }, Array.of())
  }

  _modifyModelWithRemove (model, marker) {
    this.editPart.modify(this.path, children => {
      $array.remove(children, model)

      marker.free = true

      return children
    }, Array.of())
  }
}
