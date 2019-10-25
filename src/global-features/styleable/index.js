import {$object} from '../../util'

// add simple reactive mechanism to call observer hook
function reactive (host, hook) {
  return new Proxy({}, {
    set (target, key, value) {
      target[key] = value // TODO
      host[hook](key, value)
      /*if (target[key] !== value) {
        // call property change

      }*/

      // if no return Boolean value, throw type error
      return true
    }
  })
}

const descriptorOfStyle = {
  get () {
    return this._style || (this._style = reactive(this, 'handleOfStyle'))
  },
  set (value) {
    let entries = Object.entries(value || {})

    this._style = reactive(this, 'handleOfStyle')

    for (let item of entries) {
      Reflect.set(this._style, item[0], item[1])
    }
  },
  enumerable: true,
  configurable: true
}

const descriptorOfAttribute = {
  get () {
    return this._attribute || (this._attribute = reactive(this, 'handleOfAttribute'))
  },
  set (value) {
    let entries = Object.entries(value || {})

    this._attribute = reactive(this, 'handleOfAttribute')

    for (let item of entries) {
      Reflect.set(this._attribute, item[0], item[1])
    }
  },
  enumerable: true,
  configurable: true
}

const descriptorOfClass = {
  get () {
    return this._class || (this._class = '')
  },
  set (value) {
    if (this._class !== (value = String(value))) {
      this.handleOfClass(this._class = value)
    }
  },
  enumerable: true,
  configurable: true
}


export default function styleableFeature () {
  const mixin = {}

  // data cluster
  $object.unenumerable(mixin, '_style')
  $object.unenumerable(mixin, '_attribute')
  $object.unenumerable(mixin, '_class')

  // observer hook
  /*mixin.handleOfStyle = $fn.requiredHook
  mixin.handleOfAttribute = $fn.requiredHook
  mixin.handleOfClass = $fn.requiredHook*/

  // setter or getter enter
  Reflect.defineProperty(mixin, 'style', descriptorOfStyle)
  Reflect.defineProperty(mixin, 'attribute', descriptorOfAttribute)
  Reflect.defineProperty(mixin, 'class', descriptorOfClass)

  // public function
  mixin.applyStyle = function applyStyleOfStyleable (fn = this.handleOfStyle) {
    $object.loop(this._style, (key, value) => fn.call(this, key, value))
  }
  mixin.applyAttribute = function applyAttributeOfStyleable (fn = this.handleOfAttribute) {
    $object.loop(this._attribute, (key, value) => fn.call(this, key, value))
  }
  mixin.applyClass = function applyClassOfStyleable (fn = this.handleOfClass) {
    fn.call(this, this._class)
  }

  return {
    name: 'styleable',

    mixin,

    options: {
      class: {
        merge: 'replace',
        build(widget, options) {
          // options && (widget.class = options)
        }
      },
      style: {
        merge: 'assign',
        build(widget, options) {
          // widget.style = options
        }
      },
      attr: {
        merge: 'assign',
        build(widget, options) {
          // widget.attribute = options
        }
      }
    },

    defaults: {
      on: {
        extractStyleProperties() {
          const options = this.options

          options.get('class') != null && (this.class = options.get('class'))
          this.style = options.get('style')
          this.attribute = options.get('attr')
        }
      }
    }
  }
}