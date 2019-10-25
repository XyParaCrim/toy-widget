import Widget from "../widget";
import OptionsSupport from "../../common/options-support";
import handleVisualFeature from "./features/handle-visual";
import hostFeature from "./features/host";
import displayElementFeature from "../editpart/features/display-element";
import FeatureSupport from "../../common/feature-support";

class Handle extends Widget {

}

const DEFAULTS = {
  visual: {},
  widgetClass: 'handle'
}
Handle.Options = OptionsSupport.mergeFromCtr(Widget, DEFAULTS)

const FEATURES = [
  hostFeature(),
  handleVisualFeature(),
  displayElementFeature(),
]
FeatureSupport.build(Handle, FEATURES)

export default Handle