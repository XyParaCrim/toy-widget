import {$fn, $window} from "../../../../util";
import styleableFeature from "../../../../global-features/styleable";

/**
 * dependence: {@link styleableFeature}
 * properties: el, eventTarget, styleTarget
 */
export default function elementFeature() {

  function applyElementProperties(el, eventTarget, styleTarget) {
    this.el = el
    this.eventTarget = eventTarget
    this.styleTarget = styleTarget
  }

  return {

    name: 'element',

    options: {
      createElement: {}
    },

    // styleable hooks
    mixin: {
      handleOfStyle(key, value) {
        this.state.created && $window.style(this.styleTarget, key, value)
      },
      handleOfClass(classes) {
        this.state.created && $window.classes(this.styleTarget, classes)
      },
      handleOfAttribute(key, value) {
        this.state.created && $window.attr(this.styleTarget, key, value)
      }
    },

    defaults: {
      on: {
        create() {
          let createElement, element

          createElement = this.options.get('createElement')
          $fn.throwIfNot(createElement, "Require function option to create element")

          element = createElement.call(this, this)
          if ($window.isElement(element)) {
            applyElementProperties.call(
              this,
              element,
              element,
              element
            )
          } else if (element && $window.isElement(element.el)) {
            applyElementProperties.call(
              this,
              element.el,
              element.eventTarget || element.el,
              element.styleTarget || element.el
            )
          } else {
            throw new Error('[Feature:element] Failed to create element with createElement option: ' + element)
          }

          this.emit('extractStyleProperties')

          // call mixin's function of styleable
          this.applyStyle()
          this.applyAttribute()
          this.applyClass()
        },

        dispose() {
          applyElementProperties.call(this, null, null, null)
        }
      }
    }
  }
}