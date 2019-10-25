import BasePolicy from "./base-policy";
import {$object} from "../../../../util";

class PolicyMap extends Map {
  constructor (editPart) {
    super()
    this.editPart = editPart
  }

  activate (keyOrPolicyOptions) {
    if (arguments.length === 0) {
      return this.forEach(policy => BasePolicy.activte(this.editPart, policy))
    }

    if (this.has(keyOrPolicyOptions)) {
      return BasePolicy.activte(this.editPart, this.get(keyOrPolicyOptions))
    }

    if ($object.is(keyOrPolicyOptions)) {
      let key = keyOrPolicyOptions.$name

      this.deactivate(key)
      this.set(keyOrPolicyOptions)
      BasePolicy.activte(this.editPart, this.set(keyOrPolicyOptions).get(key))
    }
  }

  deactivate (key) {
    if (arguments.length === 0) {
      this.forEach(policy => BasePolicy.deactivte(this.editPart, policy))
    } else {
      this.has(key) && this.get(key).deactivate()
    }
  }

  set (options) {
    const policy = BasePolicy.create(this.editPart, options)

    return super.set(policy.$name, policy)
  }

  clear () {
    super.clear()
    this.editPart = null
  }
}

export default PolicyMap