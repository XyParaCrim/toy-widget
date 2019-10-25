import Widget from "../widget";
import FeatureSupport from "../../common/feature-support";
import OptionsSupport from "../../common/options-support";
import modelFeature from "./features/model";
import policyFeature from "./features/policy";
import visualFeature from "./features/visual";
import trackerFeature from "./features/tracker";
import childrenFeature from "./features/children";
import compositeFeature from "./features/composite";
import hashFeature from "./features/hash";
import displayElementFeature from "./features/display-element";
import selectedFeature from "./features/selected";
import SelectablePolicy from "../../policy/selectable-policy";

class EditPart extends Widget {}

const defaults = {
  widgetClass: 'editPart',
  draggable: true,
  feedbackable: false,
  selectable: false,
  composable: false,
  policies: [ SelectablePolicy() ],
}
EditPart.Options = OptionsSupport.mergeFromCtr(Widget, defaults)

const features = [
  // 这里按照active时的调用顺序
  displayElementFeature(),
  trackerFeature(),
  visualFeature(),
  policyFeature(),
  childrenFeature(),

  // 以下features不关心事件调用顺序
  modelFeature(),
  compositeFeature(),
  hashFeature(),
  selectedFeature()
]
FeatureSupport.build(EditPart, features)

export default EditPart