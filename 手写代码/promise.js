// 手写promise
/*
    三个状态： pending(等待), fulfilled（成功）, rejected(失败)
    Promise.resolve
    Promise.reject
    Promise.then
    Promise.catch
    使用： 
    new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);  
        })
        reject(err)
    }).then((value) => {

    }, (err) => {

    }).then((value) => {

    }, (err) => {

    }).catch((err) => {

    })
*/

class Promise {
    constructor(fn) {
        this.status = 'pending' // 'fulfilled', 'rejected'
        this.value = undefined
        this.reason = undefined
        this.onResolveCallbacks = []
        this.onRejectCallbacks = []

        let resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled'
                this.value = value
                this.onResolveCallbacks.forEach(fn => fn());
            }
        }
        let reject = (err) => {
            if (this.status === 'pending') {
                this.status = 'rejected'
                this.reason = err
                this.onRejectCallbacks.forEach(fn => fn()); 
            }
        }
        try {
            fn(resolve, reject)
        } catch (err) {
            reject(err)
        }

        // then接受两个参数, 成功回调，失败回调
        then = (onResolve, onReject) => {
            if (this.status === 'fulfilled') onResolve(this.value)
            if (this.status === 'rejected') onReject(this.reason)

            if (this.status === 'pending') {
                this.onResolveCallbacks.push(onResolve(this.value))
                this.onRejectCallbacks.push(onReject(this.value))
            }
        }
    }
}