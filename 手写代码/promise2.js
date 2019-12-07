/*
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value)
        })
        reject(err)
    }).then((value) => {
        return Promise((resolve) => resolve(value+1))
    }, (err) => {

    }).then((value) => {

    }, (err) => {

    }).catch((err) => {

    })
    // 状态： 'pending', 'fulfilled', 'rejected'
    // this.value, this.err
    // 链式调用,.then.then
*/

class Promise {
    constructor(fn) {
        this.err = undefined
        this.status = 'pending'
        this.value = undefined
        this.onResolveCallbacks = []
        this.onRejectCallbacks = []

        let resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled'
                this.value = value
                this.onResolveCallbacks.forEach(fn => fn())
            }
        }
        let reject = (err) => {
            if (this.status === 'pending')  {
                this.status = 'rejected'
                this.err = err
                this.onRejectCallbacks.forEach(fn => fn())
            }
        }
        // 执行fn
        try {
            fn(resolve, reject)
        } catch (err) {
            reject(err)
        }
        
    }
    then(onResolve, onReject) {
        // (value) => {
        //     return Promise((resolve, reject) => resolve(value+1) reject(2))
        // }
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === 'fulfilled') {
                let x = onResolve(this.value) 
                this.resolvePromise(promise2, x, resolve, reject);
            }
            if (this.status === 'reject') {
                let x = onReject(this.err)
                this.resolvePromise(promise2, x, resolve, reject);
            }
            // 异步情况下
            if (this.status === 'pending') {
                this.onResolveCallbacks.push(() => {
                    let x = onResolve(this.value)
                })
                this.onRejectCallbacks.push(() => {
                    let x = onReject(this.err)
                })
            }
        })
        return promise2
    }
    resolvePromise() {
        // 搞不懂...
    }
    catch(onReject) {
        if (this.status === 'reject') onReject(this.err)
    }
}