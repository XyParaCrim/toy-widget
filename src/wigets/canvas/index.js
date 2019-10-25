import EditPart from "../editpart";
import OptionsSupport from "../../common/options-support";
import FeatureSupport from "../../common/feature-support";
import eventBusFeature from "./features/event-bus";
import operatorFeature from "./features/operator";
import toolFeature from "./features/tool";
import displayFeature from "./features/display";
import selectionFeature from "./features/selection";

class Canvas extends EditPart {}

const defaults = {
  widgetClass: 'canvas',
  feedbackable: true,
  createTracker: null,
  defaultTool: null
}
Canvas.Options = OptionsSupport.mergeFromCtr(EditPart, defaults)

const features = [
  displayFeature(),
  operatorFeature(),
  toolFeature(),
  eventBusFeature(),
  selectionFeature()
]
FeatureSupport.build(Canvas, features)

export default Canvas
