import {$array, $fn, $object, $string} from "../../util";
import EmitterEvent from './emitter-event'

/**
 * options.reverseOrder{String: "event1,event2"}: 哪些事件在options build的时候是逆序注册的，以此改变事件触发顺序.
 */
export default function emitterFeature(options) {

  function getEventMapOrCreate(emitter) {
    return emitter._events || (emitter._events = $array.makeArrayMap())
  }

  // 哪些事件在options build的时候是逆序注册的
  const reverseOrderMap = $fn.makeMap(options.reverseOrder || '')

  return {
    name: 'emitter',

    mixin: {
      on(eventName, callback, context = this) {
        $string.throwIfNot(eventName, "Require string eventName")
        $fn.throwIfNot(callback, "Require function callback")

        getEventMapOrCreate(this).$push(eventName, new EmitterEvent(eventName, callback, context))
      },

      emit(eventName, ...args) {
        $string.throwIfNot(eventName, "Require string eventName")

        getEventMapOrCreate(this).$foreachIfPresent(eventName, event => event.invoke(args))
      },

      once(eventName, callback, context) {
        const emitter = this

        function once() {
          emitter.off(eventName, callback, context)
          callback.apply(this, arguments)
        }

        emitter.on(eventName, once, context)
      },

      off(eventName, callback, context = this) {
        $string.throwIfNot(eventName, "Require string eventName")

        const eventMap = getEventMapOrCreate(this)
        let argumentsCount = arguments.length
        if (argumentsCount === 0) {
          eventMap.$clear()
          return
        }

        if (argumentsCount === 1) {
          eventMap.$certainClear(eventName)
          return;
        }

        let events = eventMap.$valuesOf(eventName)
        for (let index in events) {
          if (events[index].equals(callback, context)) {
            events.splice(index, 1)
            break
          }
        }
      },
    },

    options: {
      on: {
        merge: 'reserveWholeObject',

        build (instance, optionsValue) {
          if (optionsValue != null) {
            $object.loop(optionsValue, (event, callbacks) => {
              // 将事件逆序注册
              if (reverseOrderMap(event)) {
                callbacks = callbacks.reverse()
              }

              callbacks.forEach(callback => instance.on(event, callback))
            })
          }
        }
      }
    },

    defaults: {
      on: {
        dispose() {
          // getEventMapOrCreate(this).forEach((event, name) => this.off(name))
        }
      }
    }
  }
}