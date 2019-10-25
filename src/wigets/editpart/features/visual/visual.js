import {$object} from '../../../../util'

function callRefreshMethod (name, method, visualTarget, hostTarget) {
  method.call(visualTarget, hostTarget)
  visualTarget.emit(`refresh:${name}`, visualTarget)
}

export default class Visual {
  constructor (visualTarget, hostTarget) {
    this.methods = {}
    this.visualTarget = visualTarget
    this.hostTarget = hostTarget

    $object.loopIfObject(visualTarget.options.get('visual'), (name, method) => {
      this.methods[name] = method
    })
  }

  refresh (...somethingOfRefresh) {
    if (this.visualTarget.state.created) {
      if (somethingOfRefresh.length === 0) {
        for (let [name, method] of Object.entries(this.methods)) {
          callRefreshMethod(name, method, this.visualTarget, this.hostTarget)
        }
      } else {
        for (let what of somethingOfRefresh) {
          this.methods[what] && callRefreshMethod(what, this.methods[what], this.visualTarget, this.hostTarget)
        }
      }
    }
  }

  dispose () {
    this.visualTarget = this.hostTarget = null
  }
}
