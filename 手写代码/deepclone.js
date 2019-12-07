function deepclone(obj) {
    let result = obj instanceof Array ? [] : {}
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            result[i] = typeof obj[i] === 'object' ? deepclone(obj[i]) : obj[i]
        }
    }
    return result
}
let r = deepclone([1,2,3])
console.log('r', r);