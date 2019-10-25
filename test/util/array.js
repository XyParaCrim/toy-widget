import {$array} from '../../src/util/index'

test('append', () => {
  let prev = Array.of(1, 2, 3)
  let next = Array.of(4, 5, 6)

  $array.append(prev, next)

  expect(prev.length).toBe(6)

  prev.forEach((value, index) => expect(value).toBe(index + 1))
})
