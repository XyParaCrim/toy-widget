import Base from '../../../../common/base'
import {$object, $fn} from '../../../../util'

const symbolOfState = Symbol('policy-state')
const symbolOfOn = Symbol('on')
const symbolOfName = Symbol('name')

class BasePolicy extends Base {
  static create (editPart, options) {
    const PolicyCtor = BasePolicy.implement(options)

    return new PolicyCtor()
  }

  static activte (editPart, policy) {
    if (!this.isActivted(policy)) {
      const events = policy[symbolOfOn] = {}

      $object.loopIfObject(policy.on, (eventName, fn) => {
        editPart.on(eventName, fn, policy)
        events[eventName] = fn
      })

      policy.editPart = editPart
      policy[symbolOfState] = true
      // TODO
      try {
        policy.activate()
      } catch (e) {
        policy[symbolOfState] = false
        throw e
      }
    }
  }

  static deactivte (editPart, policy) {
    if (this.isActivted(policy)) {
      $object.loopIfObject(policy[symbolOfOn], (eventName, fn) => {
        editPart.off(eventName, fn, policy)
      })

      policy.deactivate()
      policy[symbolOfState] = false
      policy.editPart = null
    }
  }

  static isActivted (policy) {
    return policy[symbolOfState]
  }
}

BasePolicy.mix({
  activate: $fn.optionalHook,
  deactivate: $fn.optionalHook
})

export default BasePolicy
