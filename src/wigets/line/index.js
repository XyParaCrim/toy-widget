import EditPart from "../editpart";
import OptionsSupport from "../../common/options-support";

class Line extends EditPart {}

const defaults = {
  widgetClass: 'line'
}
Line.Options = OptionsSupport.mergeFromCtr(EditPart, defaults)

export default Line