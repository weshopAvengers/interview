
// reduce实现map, 修改原型
Object.defineProperties(Array.prototype, {
    reduce2Map: {
        value: function(fn) {
            return this.reduce((pre, currentItem, index, arr) => {
                pre.push(fn(currentItem, index, arr))
                return pre
            }, [])
        }
    }
})

[1,2,3].reduce2Map((item, index, arr) => {
    console.log(item, index)
})

// 不在原型
function reduceMap(fn) {
    return (list) => {
        return list.reduce((pre, item, index, arr) => {
            pre.push(fn(item, index, arr))
            return pre
        }, [])
    }
}

console.log(reduceMap((item, index) => {
    console.log(item, index)
})([2,3,4]))

// 'aabcddddees',出现最多的字符
function maxStr(str) {
    let obj = {}
    for(let i=0; i<str.length; i++) {
        if (!obj[str[i]]) obj[str[i]] = [str[i]]
        else obj[str[i]].push(str[i])
    }
    Object.keys(obj).map(item => {
        console.log(`${item}出现${obj[item].length}次`)
    })
    return obj
}

let result = maxStr('aabcddddees')
console.log('maxStr result:', result)


// 已知数据结构users，请实现语法支持user.unique能够按照name字段去重，并输出结构为：[“a”,“b”, "v"]
/* var users=[{
        id:1,name:"a"
    }, {
        id:2,name:"a"
    }, {
        id:3,name:"b"
    }, {
        id:4,name:"v"
    }]
*/
Object.defineProperties(Array.prototype, {
    unique: {
        value: function(key) {
            let obj = {}, newArr = []
            this.map(item => {
                if(!obj[item[key]]) {
                    newArr.push(item[key])
                    obj[item[key]] = true
                }
            })
            return newArr
        }
    }
})

// 再撸一遍防抖
function throttle(fn, delay) {
    let pre = Date.now()
    let timer = null

    return function(...args) {
        let now = Date.now()
        let context = this

        if(now - pre >= delay) {
            if(timer) clearTimeout(timer)
            fn.apply(context, args)
            pre = Date.now()
        } else {
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(context, args)
                    pre = Date.now()
                }, delay - (Date.now() - pre))
            }
        }
    }
}

throttle(fn, 1000)

// 实现一个简单路由
// hash路由
class Route{
  constructor(){
    // 路由存储对象
    this.routes = {}
    // 当前hash
    this.currentHash = ''
    // 绑定this，避免监听时this指向改变
    this.freshRoute = this.freshRoute.bind(this)
    // 监听
    window.addEventListener('load', this.freshRoute, false)
    window.addEventListener('hashchange', this.freshRoute, false)
  }
  // 存储
  storeRoute (path, cb) {
    this.routes[path] = cb || function () {}
  }
  // 更新
  freshRoute () {
    this.currentHash = location.hash.slice(1) || '/'
    this.routes[this.currentHash]()
  }
}


// rem原理，rem基本设置
setRem()
// 原始配置
function setRem () {
  let doc = document.documentElement
  let width = doc.getBoundingClientRect().width
  let rem = width / 75
  doc.style.fontSize = rem + 'px'
}
// 监听窗口变化
addEventListener("resize", setRem)