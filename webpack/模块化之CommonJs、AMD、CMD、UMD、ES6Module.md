## 模块化之CommonJs、AMD、CMD、UMD、ES6Module


### 前言
历史上，js没有模块化的概念，不能把一个大工程分解成很多小模块。这对于多人开发大型，复杂的项目形成了巨大的障碍，明显降低了开发效率，java，Python有import，甚至连css都有@import,但是令人费解的是js居然没有这方面的支持。es6出现之后才解决了这个问题，在这之前，各大社区也都出现了很多解决方法，比较出色的被大家广为流传的就有AMD,CMD,commonjs,UMD，今天我们就来分析这几个模块化的解决方案。

### 模块加载
上面提到的几种模块化的方案的模块加载有何异同呢？
先来说下es6模块，es6模块的设计思想是尽量静态化，使得编译时就能确定依赖关系，被称为编译时加载。其余的都只能在运行时确定依赖关系，这种被称为运行时加载。下面来看下例子就明白了，比如下面这段代码

    let {a,b,c} = require("util");//会加载util里的所有方法，使用时只用到3个方法
    import {a,b,c} from 'util';//从util中加载3个方法，其余不加载
### 模块化的几种方案
下面简单介绍一下AMD,CMD,commonjs,UMD这几种模块化方案。

#### commonjs
commonjs是服务端模块化采用的规范，nodejs就采用了这个规范。
根据commonjs的规范，一个单独的文件就是一个模块，加载模块使用require方法，该方法读取文件并执行，返回export对象。

    // foobar.js
    //私有变量
    var test = 123;
    //公有方法
    function foobar () {
    
        this.foo = function () {
            // do someing ...
        }
        this.bar = function () {
            //do someing ...
        }
    }
    //exports对象上的方法和变量是公有的
    var foobar = new foobar();
    exports.foobar = foobar;
    //读取
    var test = require('./foobar').foobar;
    test.bar();
CommonJS 加载模块是同步的，所以只有加载完成才能执行后面的操作。像Node.js主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，所以CommonJS规范比较适用。但如果是浏览器环境，要从服务器加载模块，这是就必须采用异步模式。所以就有了 AMD CMD 解决方案。

### AMD
AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"
AMD设计出一个简洁的写模块API：

    define(id?, dependencies?, factory);
第一个参数 id 为字符串类型，表示了模块标识，为可选参数。若不存在则模块标识应该默认定义为在加载器中被请求脚本的标识。如果存在，那么模块标识必须为顶层的或者一个绝对的标识。
第二个参数，dependencies ，是一个当前模块依赖的，已被模块定义的模块标识的数组字面量。
第三个参数，factory，是一个需要进行实例化的函数或者一个对象。

看下下面的例子就明白了

    define("alpha", [ "require", "exports", "beta" ], function( require, exports, beta ){
        export.verb = function(){
            return beta.verb();
            // or:
            return require("beta").verb();
        }
    });
提到AMD就不得不提requirejs。
RequireJS 是一个前端的模块化管理的工具库，遵循AMD规范，它的作者就是AMD规范的创始人 James Burke。
AMD的基本思想就是先加载需要的模块，然后返回一个新的函数，所有的操作都在这个函数内部操作，之前加载的模块在这个函数里是可以调用的。

### CMD
CMD是seajs在推广的过程中对模块的定义的规范化产出
和AMD提前执行不同的是，CMD是延迟执行，不过requirejs从2.0开始也开始支持延迟执行了，这取决于写法。
AMD推荐的是依赖前置，CMD推荐的是依赖就近。
看下AMD和CMD的代码

    //AMD
    define(['./a','./b'], function (a, b) {
        //依赖一开始就写好
        a.test();
        b.test();
    });
    
    //CMD
    define(function (requie, exports, module) {
        //依赖可以就近书写
        var a = require('./a');
        a.test();
        ...
        //软依赖
        if (status) {
            var b = requie('./b');
            b.test();
        }
    });

### UMD
UMD是AMD和commonjs的结合
AMD适用浏览器，commonjs适用服务端，如果结合了两者就达到了跨平台的解决方案。
UMD先判断是否支持AMD（define是否存在），存在用AMD模块的方式加载模块，再判断是否支持nodejs的模块（exports是否存在），存在用nodejs模块的方式，否则挂在window上，当全局变量使用。
这也是目前很多插件头部的写法，就是用来兼容各种不同模块化的写法。

    (function(window, factory) {
        //amd
        if (typeof define === 'function' && define.amd) {
            define(factory);
        } else if (typeof exports === 'object') { //umd
            module.exports = factory();
        } else {
            window.jeDate = factory();
        }
    })(this, function() {  
    ...module..code...
    })

### ES6
es6的模块自动采用严格模式，不管有没有在头部加上’use strict’
模块是由export和import两个命令构成。

#### export命令
export命令可以出现在模块的任何位置，只要处于模块的顶层（不在块级作用域内）即可。如果处于块级作用域内，会报错。
export语句输出的值是动态绑定的，绑定其所在的模块。
#### export default命令
    //a.js
    export default function(){
      console.log('aaa');
    }
    //b.js
    import aaa from 'a.js';
1.使用export default的时候，对应的import不需要使用大括号，import命令可以为default指定任意的名字。
2.不适用export default的时候，对应的import是需要使用大括号的
3.一个export default只能使用一次

### import命令
import命令具有提升效果，会提升到整个模块的头部首先执行，所以建议直接写在头部，这样也方便查看和管理。
import语句会执行所加载的模块，因为有以下的写法

    import 'lodash;
上面的代码仅仅执行了lodash模块,没有输入任何值

###     整体加载
整体加载有两种方式

    //import
    import * as circle from './circle'
    //module
    //module后面跟一个变量，表示输入的模块定义在该变量上
    module circle from './circle'
### 循环加载
在讲循环加载前，先了解下commonjs和es6模块加载的原理

commonjs模块加载的原理
commonjs的一个模块就是一个脚本文件，require命令第一次加载脚本的时候就会执行整个脚本，然后在内存中生成一个对象

    {
      id:"...",
      exports: {...},
      loaded: true,
      ...
    }
上面的对象中，id是模块名，exports是模块输出的各个接口，loaded是一个布尔值，表示该模块的脚本是否执行完毕.
之后要用到这个模块时，就会到exports上取值，即使再次执行require命令，也不会执行该模块，而是到缓存中取值

#### es6模块加载的
commonjs模块输入的是被输出值的拷贝，也就是说一旦输出一个值，模块内部的变化就影响不到这个值
es6的运行机制和commonjs不一样，它遇到模块加载命令import不会去执行模块，只会生成一个动态的只读引用，等到真正要用的时候，再到模块中去取值，由于es6输入的模块变量只是一个‘符号链接’，所以这个变量是只读的，对他进行重新赋值会报错。

    import {obj} from 'a.js';
    obj.a = 'qqq';//ok
    obj = {}//typeError
分析完两者的加载原理，来看下两者的循环加载

#### commonjs的循环加载
commonjs模块的重要特性是加载时执行，即代码在require的时候就会执行，commonjs的做法是一旦出现循环加载，就只输出已经执行的部分，还未执行的部分不会输出.
下面来看下commonjs中的循环加载的代码

    //a.js
    exports.done = false;
    var b = require('./b.js');
    console.log('在a.js中，b.done=',b.done);
    exports.done = true;
    console.log('a.js执行完毕')
    //b.js
    exports.done = false;
    var a = require('./a.js');
    console.log('在b.js中，a.done=',a.done);
    exports.done = true;
    console.log('b.js执行完毕')
    //main.js
    var a = require('./a.js');
    var b = require('./b.js');
    console.log('在main.js中，a.done=',a.done,',b.done=',b.done);
上面的代码中，执行a.js的时候，a.js先输出done变量，然后加载另一个脚本b.js，此时a的代码就停在这里，等待b.js执行完毕，再往下执行。然后看下b.js的代码，b.js也是先输出done变量，然后加载a.js，这时发生了循环加载，按照commonjs的机制，系统会去a.js中的exports上取值，可是其实a.js是没有执行完的，只能输出已经执行的部分done=false,然后b.js继续执行，执行完毕后将执行权返回给a.js，于是a.js继续执行，直到执行完毕。
所以执行main.js，结果为
在b.js中，a.done=false
b.js执行完毕
在a.js中，b=done=true
a.js执行完毕
在main.js中，a.done=true,b.done=true
上面这个例子说了两点

在b.js中a.js没有执行完，只执行了第一行
2.main.js中执行到第二行不会再次执行b.js，而是输出缓存的b.js的执行结果，即第4行

### es6的循环加载
es6处理循环加载和commonjs不同，es6是动态引用，遇到模块加载命令import时不会去执行模块，只会生成一个指向模块的引用，需要开发者自己保证能取到输出的值
看下面的例子

    //a.js
    import {odd} from 'b.js';
    export counter = 0;
    export function even(n){
      counter++;
      return n==0 || odd(n-1);
    }
    //b.js
    import {even} from 'a.js';
    export function odd(n){
      return n!=0 && even(n-1);
    }
    //main.js
    import {event,counter } from './a.js';
    event(10)
    counter //6
执行main.js，按照commonjs的规范，上面的代码是无法执行的，因为a先加载b，b又加载a，但是a又没有输出值，b的even(n-1)会报错
但是es6可以执行，结果是6