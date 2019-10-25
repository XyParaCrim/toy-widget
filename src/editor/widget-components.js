import WidgetMap from "./widget-element";
import Widget from "../wigets/widget";
import Canvas from "../wigets/canvas";
import Node from "../wigets/node";
import Line from "../wigets/line";
import Handle from "../wigets/handle";

const widgetMap = new WidgetMap(Widget)
const canvasMap = new WidgetMap(Canvas)
const nodeMap = new WidgetMap(Node)
const lineMap = new WidgetMap(Line)
const handleMap = new WidgetMap(Handle)

export default {
  Node: nodeMap,

  Line: lineMap,

  Canvas: canvasMap,

  Handle: handleMap,

  Widget: widgetMap
}