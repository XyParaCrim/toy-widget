import {$object} from "../../../../util";

export default function modelFeature () {
  return {
    name: 'model',

    options: {
      model: {}
    },

    mixin: {
      get (path) {
        return $object.get(this.model, path.split('.'))
      },
      getWithSuppress (path) {
        try {
          return this.get(path)
        } catch (e) {
        }
      },
      set (path, value) {
        let keys = path.split('.')
        let newValue = value
        let oldValue = $object.set(this.model, keys, value)

        this.state.created && this.emit(`model:${path}`, newValue, oldValue)
      },
      modify (path, fn, defaultValue) {
        let value = this.get(path)
        const modifyValue = fn(value === undefined ? defaultValue : value)

        this.set(path, modifyValue)
      },
      alias (aliasPath, sourcePath, defaultIfUndined) {
        this.on(`model:${sourcePath}`, value => this.set(aliasPath, value)) // TODO

        let initValue = this.getWithSuppress(sourcePath)
        if ($object.isUndefined(initValue) || !$object.isUndefined(defaultIfUndined)) {
          this.set(sourcePath, defaultIfUndined)
        } else {
          this.set(aliasPath, initValue)
        }
        /*    $object.isUndefined(initValue)
                ? this.set(sourcePath, defaultIfUndined)
                : this.set(aliasPath, initValue)*/
      }
    },

    defaults: {
      on: {
        init() {
          this.model = this.options.get('model')
        }
      }
    }
  }
}