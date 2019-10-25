import {$array, $fn, $object, $string} from '../util'
import ClassSupport from "./class-support";

function warnForNonBuildStrategy(widget, options) {
  console.warn('Skip a building of option since non-strategy')
}

class ReserveArray extends Array {
  push(item) {
    if ($object.instanceOf(item, ReserveArray)) {
      super.push(...item)
    } else {
      super.push(item)
    }
  }

  static of(...items) {
    let reserveArray = new ReserveArray()
    for (let item of items) {
      reserveArray.push(item)
    }
    return reserveArray
  }
}

const buildinMergeStrategies = {
  assign(key, sourceOptions, targetOption) {
    const option = sourceOptions[key] || (sourceOptions[key] = {})

    targetOption && Object.assign(option, targetOption)
  },
  assignIfObjectOrReplace(key, sourceOptions, targetOption) {
    $object.is(sourceOptions) && $object.is(targetOption)
      ? buildinMergeStrategies.assign(key, sourceOptions, targetOption)
      : buildinMergeStrategies.replace(key, sourceOptions, targetOption)
  },
  replaceString(key, sourceOptions, targetOption) {
  },
  replace(key, sourceOptions, targetOption) {
    sourceOptions[key] = targetOption
  },
  reserveObject(key, sourceOptions, targetOption) {
    if (sourceOptions[key] == null) {
      sourceOptions[key] = ReserveArray.of()
    } else if (!(sourceOptions[key] instanceof ReserveArray)) {
      sourceOptions[key] = ReserveArray.of(sourceOptions[key])
    }

    sourceOptions[key].push(targetOption)
  },
  reserveWholeObject(key, sourceOptions, targetOption) {
    const option = sourceOptions[key] || (sourceOptions[key] = {})

    if (targetOption) {
      $object.loop(targetOption, (k, v) => buildinMergeStrategies.reserveObject(k, option, v))
    }
  },
  concat(key, sourceOptions, targetOption) {
    const option = sourceOptions[key] || (sourceOptions[key] = Array.of())

    $array.is(targetOption) && $array.append(option, targetOption)
  }
}

class Options {
  constructor(values) {
    this.values = values || {}
    this.buildStrategies = {}
    this.mergeStrategies = {}
  }

  addBuildStrategy(name, strategy) {
    this.buildStrategies[name] = strategy
  }

  addMergeStrategy(name, strategy) {
    if ($string.is(strategy)) {
      this.mergeStrategies[name] = buildinMergeStrategies[strategy]
    } else {
      this.mergeStrategies[name] = strategy
    }
  }

  merge(options) {
    let values = options
    if (options instanceof Options) {
      values = options.values
    }

    if ($object.is(values)) {
      $array.is(values)
        ? values.forEach(option => this.merge(option))
        : $object.loop(values, $fn.bindFn(this.mergeItem, this))
    }

    return this
  }

  mergeItem(key, option) {
    let strategy = this.mergeStrategies[key] || OptionsSupport.defaultMergeStrategy

    strategy(key, this.values, option)
  }

  clone() {
    let clone = new Options()

    $object.loopIfObject(this.mergeStrategies, (name, strategy) => clone.addMergeStrategy(name, strategy))
    $object.loopIfObject(this.buildStrategies, (name, strategy) => clone.addBuildStrategy(name, strategy))

    return clone.merge(this)
  }

  build(widget, ...keys) {
    if (keys.length > 0) {
      for (let key of keys) {
        this.buildItem(widget, key, this.values[key])
      }
    } else {
      for (let key of Object.keys(this.buildStrategies)) {
        this.buildStrategies[key](widget, this.values[key])

        //this.buildItem(widget, key, this.values[key])
      }
    }
  }

  buildItem(widget, key, value) {
    let strategy = this.buildStrategies[key] || OptionsSupport.defaultBuildStrategy

    strategy(widget, value)
  }

  get(name) {
    return this.values[name]
  }
}

const OptionsSupport = {
  mergeStrategies: buildinMergeStrategies,

  defaultMergeStrategy: buildinMergeStrategies.replace,

  defaultBuildStrategy: warnForNonBuildStrategy,

  create(options) {
    return new Options(options)
  },

  merge(options, merged) {
    if (merged) {
      options.merge(merged)
    }
  },

  mergeFromCtr(Class, options) {
    let parentOptions = Class.Options

    return parentOptions.clone().merge(options)
  },

  extendsOptions(parentClass, ...restOptions) {
    let childClass = ClassSupport.extends(parentClass)

    if (restOptions.length > 0) {
      childClass.Options = OptionsSupport.mergeFromCtr(parentClass, restOptions[0])
      if (restOptions.length > 1) {
        for (let i = 1; i < restOptions.length; i++) {
          childClass.Options.merge(restOptions[i])
        }
      }
    }

    return childClass
  },

  validateOptions(options) {
    return options instanceof Options
  }
}

export default OptionsSupport
