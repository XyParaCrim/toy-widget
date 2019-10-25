import ClassSupport from "../common/class-support";
import OptionsSupport from "../common/options-support";
import FeatureSupport from "../common/feature-support";
import {$string} from "../util";

class WidgetMap extends Map {
  constructor (Ctor) {
    super()
    this.Ctor = Ctor
  }

  define (name, extendName, options) {
    if (arguments.length === 2) {
      options = extendName
      this.set(name, OptionsSupport.extendsOptions(this.Ctor, options))
    } else {
      if (this.has(extendName)) {
        this.set(name, OptionsSupport.extendsOptions(this.get(extendName), options))
      }
    }
  }

  mix (mixin) {
    ClassSupport.mixins(this.Ctor, mixin)
  }

  extend (...restOptions) {
    this.Ctor = OptionsSupport.extendsOptions(this.Ctor, ...restOptions)
  }

  feature(name, features) {
    let Ctor = this.Ctor
    if ($string.is(name)) {
      Ctor = this.get(name)
    } else {
      features = name
    }

    if (Ctor) {
      FeatureSupport.build(Ctor, features)
    }
  }

  of (name, options) {
    let Ctor = this.Ctor
    if (arguments.length === 1) {
      Ctor = this.Ctor
      options = name
    } else if (arguments.length === 2) {
      Ctor = this.get(name)
    }

    return Ctor ? new Ctor(options) : null
  }
}

export default WidgetMap
