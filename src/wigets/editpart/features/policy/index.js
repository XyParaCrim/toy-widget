import PolicyMap from "./policy-map";
import {$array} from "../../../../util";

export default function policyFeature() {
  return {
    name: 'policy',

    mixin: {
      use(policy) {
        /*
            if ($object.is(policies)) {
              return $object.loopOwnKeys(policies, $fn.bindFn(this.use, this))
            }

            const key = policies
            const policy = arguments[1]

            this.policies.activate(key, policy)
        */

        this.state.actived ? this.policies.activate(policy) : this.policies.set(policy)
      },
      unuse(key) {
        this.policies.deactivate(key)
      },
      isUsed(key) {
        return this.policies.has(key)
      }
    },

    options: {
      policies: {
        merge: 'concat'
      }
    },

    defaults: {
      on: {
        create() {
          let policies = this.options.get('policies')
          let policiesMap = new PolicyMap(this)

          $array.foreachIfPresent(policies, policyOptions => policiesMap.set(policyOptions))
          this.policies = policiesMap
        },

        active() {
          this.policies.activate()
        },

        deactive() {
          this.policies.deactivate()
        },

        dispose() {
          this.policies.clear()
        }
      }
    }
  }
}