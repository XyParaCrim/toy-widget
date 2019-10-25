import {unmodifiable} from "../../src/weigets/widget/util";

describe('of', () => {

  test('unmodifiable', () => {
    const Constructor = function () {}
    const unmodifiableApi = {
      test () {
        expect(this).toBe(Constructor)
      }
    }
    const UnmodifiableConstructor = unmodifiable(Constructor, unmodifiableApi)

    UnmodifiableConstructor.test()

  })

  /*test('correctness', () => {
    expect(Widget.of).toBeInstanceOf(Function)

    const ofOption = {
      option$0: {}
    }

    const CustomWidget = Widget.of(ofOption)
    expect(CustomWidget.option.option$0).toBe(ofOption.option$0)
  })

  test('option', () => {
    const symbolOption = {
      render () {
        return `<symbol></symbol>`
      },
      // 插入位置
      children: {
        default (el) {
          this.el.childNodes[0] = el
        }
      }
    }

    const pathOption = {
      render () {
        return `
            <path d="M1024 1024H64a64 64 0 0 1-64-64V64a64 64 0 0 1 64-64H1024z"/>
            <path transform="translate(1024 0)" d="M32 992V32h4403.52a32 32 0 0 1 32 32v896a32 32 0 0 1-32 32z" fill="#ffffff"/>
            <path transform="translate(1024 0)" d="M4435.52 64v896H64V64h4371.52m0-64H0v1024h4435.52a64 64 0 0 0 64-64V64a64 64 0 0 0-64-64z"/>
        `
      }
    }

    const SymbolWidget = Widget.of(symbolOption)
    const PathWidget = Widget.of(pathOption)

    new SymbolWidget().mount('default', new PathWidget())
  })*/
})
