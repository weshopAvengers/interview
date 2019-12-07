// 观察者模式实现

//  
// Observer.on('hide', (params) => {...})
// Observer.emit('hide', params)   
class Observer {
    constructor() {
        this.quenue = {}
    }
    // 订阅
    on (name, callback) {
        if (!this.quenue[name]) this.quenue[name] = [callback]
        else this.quenue[name].push(callback)
    }
    // 发布
    emit(name, params) {
        if (!this.quenue[name]) return 
        for (let i=0; i< this.quenue[name].length; i++) {
            this.quenue[name][i].call(this, {...arguments})
        }
    }
    // 
    once() {

    }

    remove() {
        
    }
}
let observer = new Observer();

observer.on('hide', (params) => {console.log('params', params)})
observer.emit('hide', {a:1}) 
