// multiply(1)(2)(3)()  6
// multiply(1)(2)(...)(n)    1*2*3*...*n


function multiply(n) {
  let temp = n
  return function a(m) {
    if (arguments.length === 0) return temp
    temp = temp * m
    return a
  }
}

console.log(multiply(1)(2)(3)(4)())



function volume (l, h, w) {
    return l * h * w
  }

// curry(1,2,3) 
// 变成curry(1)(2)(3)
function curry (fn) {
  console.log('fn.length', fn)
    return (...args) => (args.length === fn.length) ?
            fn(...args) : (..._args) => curry(...args, ..._args)
  }

  const hCy = curry(volume, 100)
  hCy(200, 900) // 18000000


// es6 柯里化
  function curry(fn) {
    return (...args) => args.length === fn.length ? fn(...args) : (..._args) => curry(...args, ..._args)
  }