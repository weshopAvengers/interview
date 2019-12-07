/*
* 手写new实现
*/

function new1() {
    // 创建新obj
    let newObj = {};
    // 拿到参数第一项，传入的构造函数
    let constructor = [].shift.apply(arguments);
    console.log('constructor',constructor)
    // 连接原型
    newObj._proto_ = constructor.prototype
    // 绑定this, 指向newObj
    console.log('arguments', [].slice.call(arguments, 1))
    let result = constructor.apply(newObj, arguments)
    console.log('result', result)
    // 返回新obj
    return result instanceof Object ? result : newObj
}

function Person(name, age) {
    this.name = name || 'haha';
    this.age = age || 18;
    this.say = function() {
        console.log('person say')
    }
    return {
        b: 1
    }
}
let a = new1(Person, 'xixi', 16)
console.log('a', a)