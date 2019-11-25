- 为什么typeof null // 'object'


因为在 JS 的最初版本中，使用的是 32 位系统， 为了性能考虑使用低位存储了变量的类型信息，000 开头代表是对象，然而 null 表示 为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了， 但是对于这个 Bug 却是一直流传下来。

- 为什么[] == ![] // -> true

```
[] == ToNumber(false)
[] == 0
ToPrimitive([]) == 0 // [].toString() -> '' '' == 0
0 == 0 // -> true
```

- 描述prototype和__proto__

函数拥有prototype，对象拥有__proto__
函数的prototype指向原型，对象的__proto__指向构造函数的原型。
[[prototype]] === __proto__

- 实现一个new
```
function create() {
  let obj = Object.create(null)
  let constructor = [].shift.call(arguments)
  obj.__proto__ = constructor.prototype
  let result = constructor.apply(obj, arguments)
  return typeof result === 'object' ? result : obj
}

- 实现instanceof
```

```
function instanceof (left, right) {
  let prototype = right.prototype;
  left = left.__proto__
  while(true) {
    if (left === null) {
      return false
    }
    if ( left === prototype) {
      return true
    }
    left = left.__proto__
  }
}
```


- 实现深拷贝
```
function sturcturalClone(obj) {
  return new Promise((resolve) => {
    const {port1, port2} = new MassageCannel()
    port2.onmessage = (ev) => resolve(ev.data)
    port1.postmessage(obj)
  })
}
```

- 手写防抖
```
function debounce(func, wait) {
  let timeout, args, timestamp, result
  const later = () => {
    let last = +new Date() - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      result = func.apply(this, args)
    }
  }

  return function () {
    args = arguments
    timestamp = +new Date()
    if (!timeout) timeout = setTimeout(later, wait)
    return result
  }
}
```

- 手写节流
```
function throttle(func, wait) {
  let args, result, timeout, previous = 0
  const later = () => {
    previous = + new Date()
    timeout = null
    result = func.apply(this, args)
  }
  return () => {
    const now = +new Date()
    if(!previous) previous = now
    const remaining = wait - (now - previous)
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      previous = now
      result = func.apply(this, args)
      if(timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
```

- 模拟实现 call, bind

```
function call(context) {
  const context || window
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

fucntion bind(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const _this = this
  const args = [...arguments].slice(1)
  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(..arguments))
  }
}
```

- 模拟实现Promise

// todo

