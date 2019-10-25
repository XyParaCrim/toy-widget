import emitterFeature from "../global-features/emitter";
import commanderFeature from "../global-features/commander";
import FeatureSupport from "../common/feature-support";
import WidgetComponents from './widget-components'
import CustomizationComponents from './customization-components'
import commonAPIFeature from "./features/common-api";
import Editor from "./editor";
import * as utils from '../util/index'
import Platform from "../common/platform";

const features = [
  emitterFeature({ reverseOrder: "deactive,dispose" }),
  commanderFeature(20),
  commonAPIFeature()
]
FeatureSupport.build(Editor, features)

export default {
  Node: WidgetComponents.Node,

  Line: WidgetComponents.Line,

  Canvas: WidgetComponents.Canvas,

  Handle: WidgetComponents.Handle,

  Widget: WidgetComponents.Widget,

  Policy: CustomizationComponents.Policy,

  Tool: CustomizationComponents.Tool,

  utils: utils,

  Platform: Platform,

  create(canvasType, options) {
    let root = WidgetComponents.Canvas.of(canvasType, options)

    return new Editor(root)
  }
}