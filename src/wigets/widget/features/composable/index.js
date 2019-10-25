import {$fn, $object} from "../../../../util";

const DefaultOptions = {
  true: {
    composite (name, widget) {
      widget = widget || name
      this.el.appendChild(widget.el)
    },
    separate (name, widget) {
      widget = widget || name
      this.el.removeChild(widget.el)
    }
  },
  false: {
    composite: $fn.falsely,
    separate: $fn.falsely
  }
}

function initHowToComposite (compositeSupport, options, mapName) {
  compositeSupport[mapName] = $fn.is(options)
    ? { default: options }
    : $object.is(options)
      ? {...options}
      : $object.empty
}

function callOptionalFn (fnMap, fnWrapper, fnContext, name, widget) {
  if (!widget) {
    widget = name
    name = 'default'
  }

  let fn = fnMap[name]

  if (fn) {
    fnWrapper(fn, fnContext, widget)
  } else {
    // TODO
    throw Error('')
  }
}

function invokeComposite (fn, fnContext, widget) {
  widget.state.create()
  if (widget.state.created) {
    fn.call(fnContext, widget)
    widget.compositeTarget = fnContext // TODO
    widget.emit('composite')
  }
}

function invokeCompositeAndThen (fn, fnContext, widget) {
  invokeComposite(fn, fnContext, widget)

  widget.parent = fnContext
  widget.root = fnContext.root
  widget.editor = fnContext.root.editor
  widget.state.active()
}

function invokeSeparate (fn, fnContext, widget) {
  if (widget.state.created) {
    if (widget.state.actived) {
      widget.state.deactive()
      widget.parent = widget.root = null
    }

    widget.emit('separate')
    widget.compositeTarget = null // TODO
    fn.call(fnContext, widget)
  }
}

function invokeSeparateAndThen (fn, fnContext, widget) {
  invokeSeparate(fn, fnContext, widget)
  widget.state.dispose()
}

export default function compositeFeature() {

  return {
    name: 'composable',

    mixin: {
      composite: $fn.optionalHook,
      separate: $fn.optionalHook
    },

    options: {
      composable: {
        merge: 'assignIfObjectOrReplace',
        build(widget, value) {
          let options = value
          if (value) {
            value === true && (options = DefaultOptions.true)
          } else {
            options = DefaultOptions.false
          }

          const compositeSupport = {}

          initHowToComposite(compositeSupport, options.composite, 'compositeMap')
          initHowToComposite(compositeSupport, options.separate, 'separateMap')

          widget.composite = function (name, widget) {
            callOptionalFn(compositeSupport['compositeMap'], invokeCompositeAndThen, this, name, widget)
          }

          widget.separate = function (name, widget) {
            callOptionalFn(compositeSupport['separateMap'], invokeSeparateAndThen, this, name, widget)
          }

          widget.compositeWithPrevent = function (name, widget) {
            callOptionalFn(compositeSupport['compositeMap'], invokeComposite, this, name, widget)
          }

          widget.separateWithPrevent = function (name, widget) {
            callOptionalFn(compositeSupport['separateMap'], invokeSeparate, this, name, widget)
          }
        }
      }
    }
  }
}