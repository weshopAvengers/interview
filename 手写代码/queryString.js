// 解析 URL 中的 queryString，返回一个对象
// 返回值示例：
// {
//   name: 'coder',
//   age: '20',
//   callback: 'https://youzan.com?name=test',
//   list: [a, b]
// }


var test = 'https://www.youzan.com?name=coder&age=20&callback=https%3A%2F%2Fyouzan.com%3Fname%3Dtest&list[]=a&list[]=b'
let obj = {}
test.split('?')[1].split('&').map((item) => {
    let key = decodeURIComponent(item.split('=')[0])
    let value = decodeURIComponent(item.split('=')[1])
    // if (key.indexOf('[]') && )
    Object.assign(obj, {
        [key]: value
    })
})
console.log(obj)