import Children from "./children";

export default function childrenFeature () {
  return {
    name: 'children',

    options: {
      children: {
        merge: 'assign'
      }
    },

    defaults: {
      on: {
        create() {
          this.children = new Children(this, this.options.get('children'))
        },
        active () {
          this.children.refresh() // parent is actived when children
        },
        deactive () {
          this.children.clear()
        },
        dispose() {
          this.children.dispose()
        }
      }
    }
  }
}