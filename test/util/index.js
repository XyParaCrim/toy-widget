import {
  $array
} from '../../src/util'

test('$array isEmpty', () => {
  expect($array.isEmpty(null)).toBeFalsy()
  expect($array.isEmpty(undefined)).toBeFalsy()
  expect($array.isEmpty({})).toBeFalsy()
  expect($array.isEmpty([1, 2])).toBeFalsy()
  expect($array.isEmpty([])).toBeTruthy()
})

test('$array last', () => {
  expect($array.last(null)).toBeUndefined()
  expect($array.last(undefined)).toBeUndefined()
  expect($array.last({})).toBeUndefined()
  expect($array.last([1, 2])).toBe(2)
  expect($array.last([])).toBeUndefined()
})

test('$array insert', () => {
  expect($array.last(null)).toBeUndefined()
  expect($array.last(undefined)).toBeUndefined()
  expect($array.last({})).toBeUndefined()
  expect($array.last([1, 2])).toBe(2)
  expect($array.last([])).toBeUndefined()

  function a () {
    console.log(Array.from(arguments))
  }
})
