// 思路：将要改变this指向的方法挂到目标this上执行并返回
Function.prototype.mycall = function (context) {
    if (typeof this !== 'function') {
      throw new TypeError('not funciton')
    }
    context = context || window
    context.fn = this
    let arg = [...arguments].slice(1)
    let result = context.fn(...arg)
    delete context.fn
    return result
  }

  // 思路：将要改变this指向的方法挂到目标this上执行并返回
Function.prototype.myapply = function (context) {
    if (typeof this !== 'function') {
      throw new TypeError('not funciton')
    }
    context = context || window
    context.fn = this
    let result
    if (arguments[1]) {
      result = context.fn(...arguments[1])
    } else {
      result = context.fn()
    }
    delete context.fn
    return result
  }

  // 思路：类似call，但返回的是函数
Function.prototype.mybind = function (context) {
    if (typeof this !== 'function') {
      throw new TypeError('Error')
    }
    let _this = this
    let arg = [...arguments].slice(1)
    return function F() {
      // 处理函数使用new的情况
      if (this instanceof F) {
        return new _this(...arg, ...arguments)
      } else {
        return _this.apply(context, arg.concat(...arguments))
      }
    }
  }