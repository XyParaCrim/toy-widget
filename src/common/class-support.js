import {$object} from "../util";

const ClassSupport = {
  extends(ParentClass) {
    class AnonymousClass extends ParentClass {}

    return AnonymousClass
  },

  mixins(mixinClass, mixin) {
    if ($object.is(mixin)) {
      $object.assignPrototype(mixinClass, mixin)
    }
  },

  hooks(object, hooks) {
    return $object.is(hooks) ? Object.assign(object, hooks) : object
  }
}
export default ClassSupport