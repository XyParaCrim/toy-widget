import {route} from '../../plugins/svg/router/free-router'
import {$math} from '../../src/util'

class Router {
  constructor (start, end, source, target) {
    this.start = start
    this.end = end
    this.source = source
    this.target = target

    this.expandedSource = source && source.clone().expand(10)
    this.expandedTarget = target && target.clone().expand(10)
  }

  getStart () {
    return this.start
  }

  getEnd () {
    return this.end
  }

  getSource () {
    return this.source
  }

  getTarget () {
    return this.target
  }

  has (point) {
    // return (this.expandedSource && this.expandedSource.within(point)) || (this.expandedTarget && this.expandedTarget.within(point))

    return point.x === 50 && point.y === 260
  }

  static route (start, end, source, target) {
    let r = new Router(start, end, source, target)
    return route.call(r, null, r)
  }
}

Router.prototype.route = route

function checkStartAndEnd (path, start, end) {
  expect(path.length >= 2).toBeTruthy()
  expect(start.equal(path[0])).toBeTruthy()
  expect(end.equal(path[path.length - 1])).toBeTruthy()

  chectkCorner(path)
}

function chectkCorner (path) {
  let direction
  for (let i = 1; i < path.length; i++) {
    expect(path[i].x === path[i - 1].x || path[i].y === path[i - 1].y).toBeTruthy()

    if (direction) {
      if (path[i].x === path[i - 1].x) {
        expect(direction + -1).toBe(0)
        direction = -1
      } else {
        expect(direction + 1).toBe(0)
        direction = 1
      }
    }
  }
}

test('相同点', () => {
  let start = $math.point.of(0, 0)
  let end = $math.point.of(0, 0)

  const router = new Router(start, end)
  const path = router.route()

  expect(path.length).toBe(2)
  checkStartAndEnd(path, start, end)
})

test('对齐点', () => {
  let start = $math.point.of(0, 0)
  let end = $math.point.of(1, 0)

  checkStartAndEnd(Router.route(start, end), start, end)
})

test('无关点', () => {
  let start = $math.point.of(0, 0)
  let end = $math.point.of(10, 10)

  checkStartAndEnd(Router.route(start, end), start, end)
})

test('fixed', () => {
  let start = $math.point.of(50, 20)
  let end = $math.point.of(550, 500)
  let source = $math.rect.of({x: 0, y: 0, width: 100, height: 20})
  let target = $math.rect.of({x: 500, y: 500, width: 100, height: 20})

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('fixed opposite', () => {
  let start = $math.point.of(50, 0)
  let end = $math.point.of(550, 520)
  let source = $math.rect.of({x: 0, y: 0, width: 100, height: 20})
  let target = $math.rect.of({x: 500, y: 500, width: 100, height: 20})

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('fixed 对齐', () => {
  let start = $math.point.of(50, 20)
  let end = $math.point.of(50, 500)
  let source = $math.rect.of({x: 0, y: 0, width: 100, height: 20})
  let target = $math.rect.of({x: 20, y: 500, width: 100, height: 20})

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('fixed opposite 对齐', () => {
  let start = $math.point.of(50, 0)
  let end = $math.point.of(50, 520)
  let source = $math.rect.of({x: 0, y: 0, width: 100, height: 20})
  let target = $math.rect.of({x: 20, y: 500, width: 100, height: 20})

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('fixed gap', () => {
  let start = $math.point.of(50, 20)
  let end = $math.point.of(550, 30)
  let source = $math.rect.of({x: 0, y: 0, width: 100, height: 20})
  let target = $math.rect.of({x: 500, y: 30, width: 100, height: 20})

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('Maximum call stack size exceeded', () => {
  let start = $math.point.of(200, 160)
  let end = $math.point.of(200, 120)
  let source = $math.rect.of({x: 100, y: 110, width: 200, height: 60})
  let target = null

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('直线', () => {
  let start = $math.point.of(100, 50)
  let end = $math.point.of(325, 150)
  let source = $math.rect.of({x: 0, y: 0, width: 200, height: 60})
  let target = null

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('已经连接且相反', () => {
  let source = $math.rect.of({x: 0, y: 0, width: 200, height: 60})
  let target = $math.rect.of({x: 0, y: 0, width: 200, height: 60})
  let start = source.midAtBottiom()
  let end = target.midAtBottiom()

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('free router', () => {
  let source = $math.rect.of({x: 10, y: 10, width: 200, height: 60})
  let target = null
  let start = source.midAtTop() // x: 110, y: 10
  let end = $math.point.of(110, 100)

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test(`
// → ←
//  ↑
`, () => {
  let source = $math.rect.of({x: 90, y: 10, width: 10, height: 10})
  let target = $math.rect.of({x: 10, y: 100, width: 200, height: 60})
  let start = source.midAtRight()
  let end = target.midAtBottiom() // x: 110, y: 70

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test(`
// ↑ ↑
//  ↑
`, () => {
  let source = $math.rect.of({x: 10, y: 10, width: 200, height: 60})
  let target = $math.rect.of({x: 500, y: 10, width: 200, height: 60})
  let start = source.midAtTop()
  let end = target.midAtBottiom() // x: 110, y: 70

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test(`
// ↑ ↑
//  ↑ with obstacle
`, () => {
  let source = $math.rect.of({x: 10, y: 10, width: 200, height: 60})
  let target = $math.rect.of({x: 230, y: 10, width: 200, height: 60})
  let start = source.midAtTop()
  let end = target.midAtBottiom() // x: 110, y: 70

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test(`←  ↑  →`, () => {
  let source = $math.rect.of({x: 10, y: 20, width: 200, height: 60})
  let target = $math.rect.of({x: 230, y: 10, width: 200, height: 60})
  let start = source.midAtTop()
  let end = target.midAtBottiom() // x: 110, y: 70

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})

test('algin with obstacle', () => {
  let source = $math.rect.of({x: 0, y: 0, width: 200, height: 60})
  let target = $math.rect.of({x: 0, y: 10, width: 200, height: 60})
  let start = source.midAtTop()
  let end = target.midAtBottiom() // x: 110, y: 70

  checkStartAndEnd(Router.route(start, end, source, target), start, end)
})