import WidgetElements from '../../widget-components'

let id = 0

// TODO
export default function commonAPIFeature(commonAPI) {
  WidgetElements.Node.mix(commonAPI)
  WidgetElements.Line.mix(commonAPI)
  WidgetElements.Handle.mix(commonAPI)
  WidgetElements.Canvas.mix(commonAPI)
  //WidgetElements.Widget.mix(commonAPI)

  return {
    name: 'commonAPI' + '$' + id++,

    mixin: commonAPI
  }
}
