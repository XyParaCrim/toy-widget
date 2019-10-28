import emitterFeature from "../global-features/emitter";
import commanderFeature from "../global-features/commander";
import FeatureSupport from "../common/feature-support";
import WidgetComponents, { WidgetComponentsAPI } from './widget-components'
import CustomizationComponents, { CustomizationComponentsApi } from './customization-components'
import commonAPIFeature from "./features/common-api";
import Editor from "./editor";
import * as utils from '../util/index'
import Platform from "../common/platform";

const features = [
  emitterFeature({ reverseOrder: "deactive,dispose" }),
  commanderFeature(20),
  commonAPIFeature(WidgetComponentsAPI),
  commonAPIFeature(CustomizationComponentsApi)
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

  Operation: CustomizationComponents.Operation,

  Platform: Platform,

  utils: utils,

  common(API) {
    FeatureSupport.build(Editor, [ commonAPIFeature(API) ])
  },

  create(canvasType, options) {
    let root = WidgetComponents.Canvas.of(canvasType, options)

    return new Editor(root)
  }
}