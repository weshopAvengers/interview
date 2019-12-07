
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