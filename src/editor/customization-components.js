
function makeSimpleMap() {
  let map = {}

  map.define = function (key, value) {
    if (key !== 'define') {
      this[key] = value
    }
  }

  return map
}

export default {
  Policy: makeSimpleMap(),
  Tool: makeSimpleMap(),
  Operation: makeSimpleMap()
}

// TODO
export const CustomizationComponentsApi = {
  tool (name, request) {
    this.root.tool.active(name, request)
  }
}