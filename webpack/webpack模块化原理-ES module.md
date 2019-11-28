[原文链接](https://segmentfault.com/a/1190000010955254)

文章介绍了webpack对commonjs模块的支持（如果你还没读过，建议你先阅读），这篇文章来探究一下，webpack是如何支持es模块的。

### 准备
我们依然写两个文件，m.js文件用es模块的方式export一个default函数和一个foo函数，index.js import该模块，具体代码如下：

    // m.js
    'use strict';
    export default function bar () {
        return 1;
    };
    export function foo () {
        return 2;
    }
    // index.js
    'use strict';
    import bar, {foo} from './m';
    bar();
    foo();
webpack配置没有变化，依然以index.js作为入口：

    var path = require("path");
    module.exports = {
        entry: path.join(__dirname, 'index.js'),
        output: {
            path: path.join(__dirname, 'outs'),
            filename: 'index.js'
        },
    };
在根目录下执行webpack，得到经过webpack打包的代码如下（去掉了不必要的注释）：
    
    (function(modules) { // webpackBootstrap
        // The module cache
        var installedModules = {};
        // The require function
        function __webpack_require__(moduleId) {
            // Check if module is in cache
            if(installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            // Create a new module (and put it into the cache)
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            // Execute the module function
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            // Flag the module as loaded
            module.l = true;
            // Return the exports of the module
            return module.exports;
        }
        // expose the modules object (__webpack_modules__)
        __webpack_require__.m = modules;
        // expose the module cache
        __webpack_require__.c = installedModules;
        // define getter function for harmony exports
        __webpack_require__.d = function(exports, name, getter) {
            if(!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    configurable: false,
                    enumerable: true,
                    get: getter
                });
            }
        };
        // getDefaultExport function for compatibility with non-harmony modules
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ?
                function getDefault() { return module['default']; } :
                function getModuleExports() { return module; };
            __webpack_require__.d(getter, 'a', getter);
            return getter;
        };
        // Object.prototype.hasOwnProperty.call
        __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
        // __webpack_public_path__
        __webpack_require__.p = "";
        // Load entry module and return exports
        return __webpack_require__(__webpack_require__.s = 0);
    })
    ([
    (function(module, __webpack_exports__, __webpack_require__) {
    
        "use strict";
        Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__m__ = __webpack_require__(1);
    
        Object(__WEBPACK_IMPORTED_MODULE_0__m__["a" /* default */])();
        Object(__WEBPACK_IMPORTED_MODULE_0__m__["b" /* foo */])();
    
    }),
    (function(module, __webpack_exports__, __webpack_require__) {
    
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__["a"] = bar;
        /* harmony export (immutable) */
        __webpack_exports__["b"] = foo;
    
        function bar () {
            return 1;
        };
        function foo () {
            return 2;
        }
    
    })
    ]);
### 分析
上一篇文章已经分析过了，webpack生成的代码是一个IIFE，这个IIFE完成一系列初始化工作后，就会通过__webpack_require__(0)启动入口模块。

我们首先来看m.js模块是如何实现es的export的，被webpack转换后的m.js代码如下：

    __webpack_exports__["a"] = bar;
    __webpack_exports__["b"] = foo;
    
    function bar () {
        return 1;
    };
    function foo () {
        return 2;
    }
其实一眼就能看出来，export default和export都被转换成了类似于commonjs的exports.xxx，这里也已经不区分是不是default export了，所有的export对象都是__webpack_exports__的属性。

我们继续来看看入口模块，被webpack转换后的index.js代码如下：

    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    var __WEBPACK_IMPORTED_MODULE_0__module__ = __webpack_require__(1);
    
    Object(__WEBPACK_IMPORTED_MODULE_0__m__["a" /* default */])();
    Object(__WEBPACK_IMPORTED_MODULE_0__m__["b" /* foo */])();
index模块首先通过Object.defineProperty在__webpack_exports__上添加属性__esModule ，值为true，表明这是一个es模块。在目前的代码下，这个标记是没有作用的，至于在什么情况下需要判断模块是否es模块，后面会分析。

然后就是通过__webpack_require__(1)导入m.js模块，再然后通过module.xxx获取m.js中export的对应属性。注意这里有一个重要的点，就是所有引入的模块属性都会用Object()包装成对象，这是为了保证像Boolean、String、Number这些基本数据类型转换成相应的类型对象。

### commonjs与es6 module混用
我们前面分析的都是commonjs模块对commonjs模块的导入，或者es模块对es模块的导入，那么如果是es模块对commonjs模块的导入会是什么情况呢，反过来又会如何呢？

其实我们前面说到的__webpack_exports__. __esModule = true就是针对这种情况的解决方法。

下面用具体代码来解释一下，首先修改m.js和index.js代码如下：

    // m.js
    'use strict';
    exports.foo = function () {
        return 1;
    }
    // index.js
    'use strict';
    import m from './m';
    m.foo();
重新执行webpack后生成的代码如下（只截取IIFE的参数部分）：

    [
    /* 0 */
    (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */ 
    var __WEBPACK_IMPORTED_MODULE_0__m__ = __webpack_require__(1);
    /* harmony import */ 
    var __WEBPACK_IMPORTED_MODULE_0__m___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__m__);

    __WEBPACK_IMPORTED_MODULE_0__m___default.a.foo();

    }),
    /* 1 */
    (function(module, exports, __webpack_require__) {

    "use strict";
    exports.foo = function () {
        return 1;
    }

})
]
m.js转换后的代码跟转换前的代码基本没有变化，都是用webpack提供的exports进行模块导出。但是index.js有一点不同，主要是多了一行代码：

    var __WEBPACK_IMPORTED_MODULE_0__m___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__m__);
这段代码作用是什么呢，看一下__webpack_require__.n的定义就知道了：

    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ?
            function getDefault() { return module['default']; } :
            function getModuleExports() { return module; };
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };
__webpack_require__.n会判断module是否为es模块，当__esModule为true的时候，标识module为es模块，那么module.a默认返回module.default，否则返回module。

具体实现则是通过 __webpack_require__.d将具体操作绑定到属性a的getter方法上的。

那么，当通过es模块的方式去import一个commonjs规范的模块时，就会把require得到的module进行一层包装，从而兼容两种情况。

至于通过commonjs去require一个es模块的情况，原理相同，就不过多解释了。

### 结论
webpack对于es模块的实现，也是基于自己实现的__webpack_require__ 和__webpack_exports__ ，装换成类似于commonjs的形式。对于es模块和commonjs混用的情况，则需要通过__webpack_require__.n的形式做一层包装来实现。

下一篇webpack模块化原理-Code Splitting，会继续来分析webpack是如何通过动态import和module.ensure实现Code Splitting的。