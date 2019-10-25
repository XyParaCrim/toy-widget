import {$object, $string} from "../util";
import ClassSupport from "./class-support";
import OptionsSupport from "./options-support";

const FeatureSupport = {
  build(Class, features) {
    const options = Class.Options

    // first round: check available and mixin
    for (let feature of features) {
      $object.throwIfNull(feature, "Expected non-null feature")
      $string.throwIfNot(feature.name, "Expected string feature.name")

      // build mixin
      ClassSupport.mixins(Class, feature.mixin)
    }

    if (OptionsSupport.validateOptions(options)) {
      // second round: register strategies
      for (let feature of features) {
        // build options mechanism
        if (feature.options) {
          $object.loopIfObject(feature.options, (name, mechanism) => {
            if (mechanism.build) {
              options.addBuildStrategy(name, mechanism.build)
            }

            if (mechanism.merge) {
              options.addMergeStrategy(name, mechanism.merge)
            }
          })
        }
      }

      // third round: merge
      for (let feature of features) {
        // merge options of feature
        if (feature.defaults) {
          options.merge(feature.defaults)
        }
      }
    }
  }
}

export default FeatureSupport