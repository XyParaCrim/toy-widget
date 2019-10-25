import FeatureSupport from "../../common/feature-support";
import State from "./state";
import OptionsSupport from '../../common/options-support'
import emitterFeature from "../../global-features/emitter";
import styleableFeature from "../../global-features/styleable";
import elementFeature from "./features/element";
import compositeFeature from "./features/composable";
import {$util} from "../../util";

function Widget(options) {
  this.options = OptionsSupport.mergeFromCtr(this.constructor, options)
  this.state = new State(this)
  this.uuid = $util.genUUID()

  this.options.build(this)
  this.state.init()
}

const defaults = { widgetClass: 'widget' }
Widget.Options = OptionsSupport.create(defaults)

const features = [
  // global feature
  emitterFeature({
    reverseOrder: "deactive,dispose"
  }),
  styleableFeature(),
  // local feature
  elementFeature(),
  compositeFeature(),
]
FeatureSupport.build(Widget, features)

export default Widget



