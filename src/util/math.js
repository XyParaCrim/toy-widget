const InfinityToZero = 1 / Number.MAX_VALUE

function precise (value, precision = 10) {
  return Math.round(value * precision) / precision
}

function round (value, scale = 1) {
  return scale * Math.round(value / scale)
}

function ceil (value, scale = 1) {
  return scale * Math.ceil(value / scale)
}

function floor (value, scale = 1) {
  return scale * Math.floor(value / scale)
}

function within (bbox, point) {
  return (point.x > bbox.x) && (point.y > bbox.y) && point.x < (bbox.x + bbox.width) && point.y < (bbox.y + bbox.height)
}

function contains (bbox, point) {
  return (point.x >= bbox.x) && (point.y >= bbox.y) && point.x <= (bbox.x + bbox.width) && point.y <= (bbox.y + bbox.height)
}

function observe (r1, r2) {
  return (r1.x < r2.x) && (r1.y < r2.y) && (r1.x + r1.width > r2.x + r2.width) && (r1.y + r1.height > r2.y + r2.height)
}

function left (bbox) {
  return bbox.x
}

function right (bbox) {
  return bbox.x + bbox.width
}

function top (bbox) {
  return bbox.y
}

function bottom (bbox) {
  return bbox.y + bbox.height
}

function center (bbox) {
  return Point.of(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
}
/*
distance(r1, r2) {
  return Math.sqrt((r1[0] - r2[0]) * (r1[0] - r2[0]) + (r1[1] - r2[1]) * (r1[1] - r2[1]));
}
*/

function intOrMax (value) {
  return isNaN(value = Number(value)) ? Number.MAX_VALUE : value
}

class Point {
  static keyOf (x, y) {
    return x + '_' + y
  }

  static of (x, y) {
    return new Point(x, y)
  }

  /**
   * @param x (Object|String|Number)
   * @param y (Number)
   */
  constructor (x, y) {
    if (typeof x === 'object') {
      this.x = x.x
      this.y = x.y
    } else if (typeof x === 'string') {
      let spilt = x.split('_')

      this.x = parseFloat(spilt[0])
      this.y = parseFloat(spilt[1])
    } else {
      this.x = x
      this.y = y
    }
  }

  different (point) { // in perpendicular case
    let dx, dy
    if (point) {
      dx = this.x - point.x
      dy = this.y - point.y
    } else {
      dx = dy = NaN
    }

    return new Point(dx, dy)
  }

  differentTo (point) {
    let dx, dy
    if (point) {
      dx = point.x - this.x
      dy = point.y - this.y
    } else {
      dx = dy = NaN
    }

    return new Point(dx, dy)
  }

  opposite () {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  normalize () {
    this.x = number.normalize(this.x)
    this.y = number.normalize(this.y)

    return this
  }

  distanceOfSqrt (p, isSqrt = true) {
    let val = Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2)

    return isSqrt ? Math.sqrt(val) : val
  }

  distanceOfManhattan (p, corner = 0) {
    let dx = Math.abs(p.x - this.x)
    let dy = Math.abs(p.y - this.y)
    return dx & dy ? dx + dy + corner : dx + dy
  }

  offset (dx, dy) {
    if (typeof dx === 'object') {
      dy = dx.y
      dx = dx.x
    }
    this.x += dx || 0
    this.y += dy || 0

    return this
  }

  horizontal (point) {
    return this.y === point.y
  }

  vertical (point) {
    return this.x === point.x
  }

  isLeft (point) {
    return this.x < point.x
  }

  isTop (point) {
    return this.y < point.y
  }

  original () {
    return this.x === 0 && this.y === 0
  }

  clone () {
    return new Point(this.x, this.y)
  }

  equal ({x, y}) {
    return x === this.x && y === this.y
  }

  get key () {
    return Point.keyOf(this.x, this.y)
  }

  toString () {
    return `{x: ${this.x}, y: ${this.y}}`
  }
}

class Line {

  static of (x1, y1, x2, y2) {
    if (arguments.length === 4) {
      return new Line(Point.of(x1, y1), Point.of(x2, y2))
    }

    return new Line(x1, y1)
  }

  constructor (start, end) {
    this.start = start
    this.end = end
  }

  isLeft (point) {
    return crossProduct({x: this.start.x - point.x, y: this.start.y - point.y}, {x: this.end.x - point.x, y: this.end.y - point.y}) > 0
  }

  isIntersect (line) {
    if (this.isLeft(line.start) && this.isLeft(line.end)) return false

    if (line.isLeft(this.start) && line.isLeft(this.end)) return false

    return true
  }
}

class Rect {
  static of (left, right, top, bottom) {
    if (arguments.length === 1 && left) {
      return new Rect(left)
    }

    if (arguments.length === 4) {
      return new Rect({x: left, y: top, width: right - left, height: bottom - top})
    }

    return null
  }

  constructor ({x, y, width, height}) {
    this.x = precise(x)
    this.y = precise(y)
    this.width = precise(width)
    this.height = precise(height)
  }

  left () {
    return left(this)
  }

  right () {
    return right(this)
  }

  top () {
    return top(this)
  }

  bottom () {
    return bottom(this)
  }

  center () {
    return center(this)
  }

  midAtTop () {
    return Point.of(this.x + this.width / 2, this.top())
  }

  midAtBottiom () {
    return Point.of(this.x + this.width / 2, this.bottom())
  }

  midAtLeft () {
    return Point.of(this.left(), this.y + this.height / 2)
  }

  midAtRight () {
    return Point.of(this.right(), this.y + this.height / 2)
  }

  lineOfTop () {
    return Line.of(this.left(), this.top(), this.right(), this.top())
  }

  lineOfBottom () {
    return Line.of(this.right(), this.bottom(), this.left(), this.bottom())
  }

  lineOfLeft () {
    return Line.of(this.left(), this.top(), this.left(), this.bottom())
  }

  lineOfRight () {
    return Line.of(this.right(), this.top(), this.right(), this.bottom())
  }

  contains (point) {
    return contains(this, point)
  }

  within (point) {
    return within(this, point)
  }

  clone () {
    return new Rect(this)
  }

  expand (padding) {
    this.x -= padding
    this.y -= padding
    this.width += 2 * padding
    this.height += 2 * padding

    return this
  }

  isContainsWithLine (point1, point2) {
    if (this.contains(point1) || this.contains(point2)) return true

    let line = Line.of(point1, point2)

    return line.isIntersect(Line.of(this.x, this.y, this.right(), this.bottom())) ||
        line.isIntersect(Line.of(this.x, this.bottom(), this.right(), this.y))
  }

  isWithinWithLine (point1, point2) {
    if (this.within(point1) && this.within(point2)) return true

    let line = Line.of(point1, point2)

    return line.isIntersect(Line.of(this.x, this.y, this.right(), this.bottom())) ||
        line.isIntersect(Line.of(this.x, this.bottom(), this.right(), this.y))
  }

  isCrossWithLine (point1, point2) {
    if (!this.within(point1) && !this.within(point2)) {
      let line = Line.of(point1, point2)

      return line.isIntersect(Line.of(this.x + 1, this.y + 1, this.right() - 1, this.bottom() - 1)) ||
          line.isIntersect(Line.of(this.x + 1, this.bottom() - 1, this.right() - 1, this.y + 1))
    }

    return false
  }

  union (rect) {
    if (rect) {
      let x = Math.min(rect.x, this.x)
      let y = Math.min(rect.y, this.y)

      this.width = (rect.right() > this.right() ? rect.right() : this.right()) - x
      this.height = (rect.bottom() > this.bottom() ? rect.bottom() : this.bottom()) - y
      this.x = x
      this.y = y
    }

    return this
  }

  different (rect) {
    let left, right, top, bottom

    left = right = top = bottom = 0

    if (rect) {
      if (rect.right() < this.x) {
        left = rect.right()
        right = this.x
      } else if (rect.x > this.right()) {
        left = this.right()
        right = rect.x
      }

      if (rect.bottom() < this.y) {
        top = rect.bottom()
        bottom = this.y
      } else if (rect.y > this.bottom()) {
        top = this.bottom()
        bottom = rect.y
      }
    }

    return Rect.of(left, right, top, bottom)
  }

  intersect (rect) {
    if (rect) {
      if (rect.right() <= this.x || rect.bottom() <= this.y || rect.x >= this.right() || rect.y >= this.bottom()) { return null }

      return Rect.of(
          Math.max(rect.x, this.x),
          Math.min(rect.right(), this.right()),
          Math.max(rect.y, this.y),
          Math.min(rect.bottom(), this.bottom()))
    }

    return null
  }

  isIntoWithLine (start, end) {
    return !this.within(start) && this.within(end)
  }

  toString () {
    return `{x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}}`
  }
}

const number = {
  normalize (value) {
    return value ? value / Math.abs(value) : 0
  },
  between (val, min, max) {
    return (val - min) * (val - max) <= 0
  },
  lcm (value1, value2) {
    // if (!value1) return value2
  },
  corrected (value, base) {
    if (!value) return base

    value = Math.abs(value)
    if (value < base) return value

    let n = Math.round(value / base)
    let remainder = value - n * base

    return base + remainder / n
  }
}

/* function intersections (point1, point2, bbox) {
  let result = []

  if (this.y === 0 && start.y - end.y === 0) { // horizontal
    let left = $math.left(bbox)
    if ($Number.between(left, start.x, end.x)) {
      result.push($Point.of(left, start.y))
    }

    let right = $math.right(bbox)
    if ($Number.between(right, start.x, end.x)) {
      result.push($Point.of(right, start.y))
    }
  } else if (this.x === 0 && start.x - end.x === 0) { // not horizontal
    let top = $math.top(bbox)
    if ($Number.between(top, start.y, end.y)) {
      result.push($Point.of(start.x, top))
    }

    let bottom = $math.bottom(bbox)
    if ($Number.between(bottom, start.y, end.y)) {
      result.push($Point.of(start.x, bottom))
    }
  } else {
    console.warn('intersections')
  }

  return result
} */

function angle (vector) {
  let x = vector.x
  let y = vector.y

  let pi = Math.atan(x === 0 ? Infinity * y : y / x)

  return Math.round(pi / Math.PI * 180)
}

function dotProduct (p1, p2) {
  return p1.x * p2.x + p1.y * p2.y
}

function crossProduct (p1, p2) {
  return p1.x * p2.y - p1.y * p2.x
}

export default {
  angle,
  floor,
  ceil,
  round,
  precise,
  observe,
  within,
  contains,
  intOrMax,
  left,
  right,
  top,
  bottom,
  center,
  point: Point,
  number,
  rect: Rect,
  dotProduct,
  InfinityToZero
}
