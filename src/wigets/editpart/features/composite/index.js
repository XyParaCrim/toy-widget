export default function compositeFeature () {
  function getStore (editPart, type) {
    const store = editPart.children.getStore(type)
    if (!store) {
      throw Error() // TODO
    }

    return store
  }


  return {
    name: 'composite',

    mixin: {
      addChild (type, child) {
        if (arguments.length === 1) {
          child = type
          type = child.compositedType()
        }

        const store = getStore(this, type)

        store.addOrUpdate(child)
      },
      removeChild (editPart) {
        const store = getStore(this, editPart.compositedType())

        store.remove(editPart)
      },
      detachChild (editPart) {
        const store = getStore(this, editPart.compositedType())

        store.removeWithPrevent(editPart)
      },

      appendTo (parent, type = this.compositedType()) {
        parent.addChild(type, this)
      },
      remove () {
        this.parent.removeChild(this)
      },
      detach () {
        this.parent.detachChild(this)
      }
    }
  }
}