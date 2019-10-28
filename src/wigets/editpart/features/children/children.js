import {$object} from "../../../../util";
import CompositedStore from "../../../../common/composited-store";
import CompositedObserver from "../../../../common/composited-observer";

class Children {
  constructor (editPart, childrenOptions) {
    this.editPart = editPart
    // auto composite by model --- children
    this.stores = Array.of()
    $object.loopIfObject(childrenOptions, (eventPrefix, options) => this.stores.push(new CompositedStore(editPart, eventPrefix, options)))
  }

  clear () {
    this.stores.forEach(store => store.clear())
  }

  refresh () {
    this.stores.forEach(store => store.refresh())
  }

  getStore (type) {
    for (let store of this.stores) {
      if (store.eventPrefix === type) {
        return store
      }
    }
  }

  createObserver (type) {
    return CompositedObserver.create(this.getStore(type))
  }

  dispose () {
    this.editPart = null
    this.stores.forEach(store => store.dispose())
  }
}

export default Children