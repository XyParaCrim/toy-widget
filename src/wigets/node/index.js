import EditPart from "../editpart";
import OptionsSupport from "../../common/options-support";

class Node extends EditPart {

}

const defaults = {
  widgetClass: 'node',
  linkable: false
}
Node.Options = OptionsSupport.mergeFromCtr(EditPart, defaults)

export default Node