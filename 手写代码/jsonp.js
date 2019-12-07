// 手写jsonp

// 使用方式：
jsonp('http://www.api.com/api/v1/getNum', {age: 18, name: '20'})
.then((res) => {
    console.log(res)
})

// 实现jsonp函数
function jsonp(url, params) {
    new Promise((resolve, reject) => {
            // 1.拼接url和params，类似http://www.api.com/api/v1/getNum?age=18&name=20&jsonpCB_时间戳
        let callbackName = `jsonpCB_${Date.now()}`;

        url = url.indexOf('?') === -1 ? '?' : '&'
        Object.keys(params).map(key => {
            url += `&${key}=${params[key]}`
        })
        url = `${url}&jsonpCB_${Date.now()}`

        //2.创建script标签
        let scriptNode = document.createElement('script')
        scriptNode.src = url

        //3.触发callback
        window[callbackName] = (res) => {
            delete window[callbackName]
            document.removeChild(scriptNode)
            try {
                resolve(res)
            } catch (e) {
                reject(e)
            }
        }

        // 插入script
        document.appendChild(scriptNode);
    })
}