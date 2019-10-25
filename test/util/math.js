import {$math} from '../../src/util'

test('angle', () => {
  expect($math.angle({x: 1, y: 0})).toBe(0)
})

test('isCrossWithLine', () => {
  let rect = $math.rect.of(0, 100, 0, 20)

  expect(rect.isCrossWithLine($math.point.of(0, 20), $math.point.of(0, 40))).toBeFalsy()


  let source = $math.rect.of({x: 0, y: 0, width: 200, height: 60})
  let target = $math.rect.of({x: 60, y: 360, width: 200, height: 60})
  let start = $math.point.of(100, 60)
  let end = $math.point.of(100, 370)

  expect(source.isCrossWithLine(start, end)).toBeFalsy()
  expect(target.isCrossWithLine(start, end)).toBeFalsy()
})
