import TAFFY from '../../lib/taffy'
import {$util} from '../util'

/*
export default class Store {

    static storePool = new WeakMap()

    static newStore (editor) {
        throwIfNull(editor, `can't create new store: editor is null`)

        let store = Store.storePool.get(editor)
        if (store != null) {
            store().remove()
        }

        store = new Store()
        Store.storePool.set(editor, store)
        return store
    }

    /!*static getStore(editor) {
        return Store.storePool.get(editor)
    }

    static remove (editor) {
        let store = Store.
    }*!/

    constructor () {
        this.node = taffy()
        this.line = taffy()
    }
} */

const Store = {
  _storeMap: {},
  newStore (id) {
    id || (id = $util.genUUID())
    this._storeMap[id] = {
      node: TAFFY(),
      line: TAFFY()
    }
    return id
  },
  get (id, key) {
    return key != null ? this._storeMap[id][key] : this._storeMap[id]
  },
  remove (id) {
    if (id && this._storeMap[id]) {
      this._storeMap[id].node().remove()
      this._storeMap[id].line().remove()
      this._storeMap[id].node = null
      this._storeMap[id].line = null
      delete this._storeMap[id]
    }
  }
}

export default Store
