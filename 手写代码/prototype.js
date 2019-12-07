function Person(name, age) {
    this.name = name;
    this.height = '165';
    this.eat = function() {
        console.log('this.name', this.name)
    }
}
Person.prototype.color = 'black'
Person.prototype.workFn = function() {
    this.sex = 'man'
}
Person.prototype.read = function() {
    console.log('this.name', this.name)
}

var person1 = new Person('wmm', 30)
