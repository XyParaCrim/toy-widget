import CompositedMarker from "../../../../common/composited-marker";
import {$array, $fn} from "../../../../util";

function reachParent(editPart) {
  return editPart.state.actived || editPart.state.activing
}

export default function hashFeature() {
  return {
    name: 'hash',

    mixin: {
      // hash
      compositedKey() {
        return CompositedMarker.keyOf(this.model)
      },
      compositedType() {
        return CompositedMarker.typeOf(this.model)
      },
      compositedOf(type, model) {
        const store = this.children.getStore(type)

        return store ? store.create(this, model) : null
      },

      // observse by hash
      observser(type) {
        return this.children.createObserver(type)
      },

      // query
      siblings(fnOrKey, type = this.compositedType()) {
        if (reachParent(this)) {
          return this.parent.child(fnOrKey, type)
        }

        throw Error()
      },
      compositedSiblings(fnOrKey, type = this.compositedType()) {
        if (this.compositeTarget) {
          return this.compositeTarget.child(fnOrKey, type)
        }

        throw Error()
      },
      child(fnOrKey, type) {
        const store = this.children.getStore(type)

        if ($fn.is(fnOrKey)) {
          store && store.forEach(fnOrKey)
        } else {
          return store ? store.get(fnOrKey) : null
        }
      },
      valuesOfChilren(type) {
        const children = Array.of()

        if (arguments.length === 0) {
          for (let store of this.children.stores) {
            $array.append(children, $array.copy(store.values()))
          }
        } else {
          for (let i = 0; i < arguments.length; i++) {
            let store = this.children.getStore(arguments[i])

            store && $array.append(children, $array.copy(store.values()))
          }
        }

        return children
      }
    }
  }
}