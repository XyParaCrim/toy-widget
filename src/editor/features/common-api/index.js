import WidgetElements from '../../widget-components'

export default function commonAPIFeature() {

  const commonAPI = {
    nodeComponents() {
      return WidgetElements.Node
    },
    lineComponents() {
      return WidgetElements.Line
    },

    canvasComponents() {
      return WidgetElements.Canvas
    },

    handleComponents() {
      return WidgetElements.Handle
    },

    widgetComponents() {
      return WidgetElements.Widget
    },

    tool (name, request) {
      this.root.tool.active(name, request)
    }
  }

  WidgetElements.Node.mix(commonAPI)
  WidgetElements.Line.mix(commonAPI)
  WidgetElements.Handle.mix(commonAPI)
  WidgetElements.Canvas.mix(commonAPI)
  //WidgetElements.Widget.mix(commonAPI)

  return {
    name: 'commonAPI',

    mixin: commonAPI
  }
}