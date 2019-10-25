import Editor from '../../../src/editor/editor'

describe('editor', () => {

    test('define canvas', () => {

        Editor.Canvas.define('flow', {
            tagName: 'svg',
            attr: { 'version': '1.1' },
            style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '150%',
                height: '150%'
            },
            on: {
                create () {

                }
            }
        })


    })

})
