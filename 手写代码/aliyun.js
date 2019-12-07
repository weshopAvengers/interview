/*
1、阿里云产品线十分丰富，拥有ECS、RDS等数百款产品，每个产品都具有一些通用属性，
例如：ID（id），地域（region），名称（name），同时每个产品又包含自己特有的属性。 
ECS拥有实例（instance）属性，可选值有ecs.t1.small、ecs.t3.small、ecs.t1.large
 RDS拥有数据库类型（dbType）属性，可选值有mysql、mssql、PPAS，
 请使用你的面向对象知识，基于ES6语法编写ECS、RDS两个类，并实现如下方法： 
 1. config() 返回一个字面量对象，可以拿到所有的成员变量。 
 2. buy() 返回一个URL，格式为 
 https://www.aliyun.com/buy?id=xxx®ion=xxx&name=xxx&每个产品自己特有的成员变量
*/
class Product {
    constructor(id, region, name) {
        this.id = id
        this.region = region
        this.name = name
    }
}
class ECS extends Product{
    constructor(id, region, name) {
        super(id, region, name)
    }
    config(instance) {
        this.instance = instance
        return this
    }
    buy() {
        let url = 'https://www.aliyun.com/buy?'
        Object.keys(this).map((key, i) => {
            url += i === 0 ? `${key}=${this[key]}` : `&${key}=${this[key]}`
        })
        return url
    }
}
let a = new ECS('1', '杭州', '哈哈')
a.config('ecs.t1.small')
a.buy()