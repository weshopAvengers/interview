我们都知道，webpack作为一个构建工具，解决了前端代码缺少模块化能力的问题。我们写的代码，经过webpack构建和包装之后，能够在浏览器以模块化的方式运行。这些能力，都是因为webpack对我们的代码进行了一层包装，本文就以webpack生成的代码入手，分析webpack是如何实现模块化的。

PS: webpack的模块不仅指js，包括css、图片等资源都可以以模块看待，但本文只关注js。

准备
首先我们创建一个简单入口模块index.js和一个依赖模块bar.js：

//index.js
'use strict';
var bar = require('./bar');
function foo() {
    return bar.bar();
}
//bar.js
'use strict';
exports.bar = function () {
    return 1;
}
webpack配置如下：

var path = require("path");
module.exports = {
    entry: path.join(__dirname, 'index.js'),
    output: {
        path: path.join(__dirname, 'outs'),
        filename: 'index.js'
    },
};
这是一个最简单的配置，只指定了模块入口和输出路径，但已经满足了我们的要求。

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
/************************************************************************/
([
/* 0 */
(function(module, exports, __webpack_require__) {

"use strict";

var bar = __webpack_require__(1);
bar.bar();

}),
/* 1 */
(function(module, exports, __webpack_require__) {

"use strict";

exports.bar = function () {
    return 1;
}

})
]);
分析
上面webpack打包的代码，整体可以简化成下面的结构：

(function (modules) {/* 省略函数内容 */})
([
function (module, exports, __webpack_require__) {
    /* 模块index.js的代码 */
},
function (module, exports, __webpack_require__) {
    /* 模块bar.js的代码 */
}
]);
可以看到，整个打包生成的代码是一个IIFE(立即执行函数)，函数内容我们待会看，我们先来分析函数的参数。

函数参数是我们写的各个模块组成的数组，只不过我们的代码，被webpack包装在了一个函数的内部，也就是说我们的模块，在这里就是一个函数。为什么要这样做，是因为浏览器本身不支持模块化，那么webpack就用函数作用域来hack模块化的效果。

如果你debug过node代码，你会发现一样的hack方式，node中的模块也是函数，跟模块相关的参数exports、require，或者其他参数__filename和__dirname等都是通过函数传值作为模块中的变量，模块与外部模块的访问就是通过这些参数进行的，当然这对开发者来说是透明的。

同样的方式，webpack也控制了模块的module、exports和require，那么我们就看看webpack是如何实现这些功能的。

下面是摘取的函数内容，并添加了一些注释：

// 1、模块缓存对象
var installedModules = {};
// 2、webpack实现的require
function __webpack_require__(moduleId) {
    // 3、判断是否已缓存模块
    if(installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // 4、缓存模块
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };
    // 5、调用模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // 6、标记模块为已加载
    module.l = true;
    // 7、返回module.exports
    return module.exports;
}
// 8、require第一个模块
return __webpack_require__(__webpack_require__.s = 0);
模块数组作为参数传入IIFE函数后，IIFE做了一些初始化工作：

IIFE首先定义了installedModules ，这个变量被用来缓存已加载的模块。
定义了__webpack_require__ 这个函数，函数参数为模块的id。这个函数用来实现模块的require。
__webpack_require__ 函数首先会检查是否缓存了已加载的模块，如果有则直接返回缓存模块的exports。
如果没有缓存，也就是第一次加载，则首先初始化模块，并将模块进行缓存。
然后调用模块函数，也就是前面webpack对我们的模块的包装函数，将module、module.exports和__webpack_require__作为参数传入。注意这里做了一个动态绑定，将模块函数的调用对象绑定为module.exports，这是为了保证在模块中的this指向当前模块。
调用完成后，模块标记为已加载。
返回模块exports的内容。
利用前面定义的__webpack_require__ 函数，require第0个模块，也就是入口模块。
require入口模块时，入口模块会收到收到三个参数，下面是入口模块代码：

function(module, exports, __webpack_require__) {
    "use strict";
    var bar = __webpack_require__(1);
    bar.bar();
}
webpack传入的第一个参数module是当前缓存的模块，包含当前模块的信息和exports；第二个参数exports是module.exports的引用，这也符合commonjs的规范；第三个__webpack_require__ 则是require的实现。

在我们的模块中，就可以对外使用module.exports或exports进行导出，使用__webpack_require__导入需要的模块，代码跟commonjs完全一样。

这样，就完成了对第一个模块的require，然后第一个模块会根据自己对其他模块的require，依次加载其他模块，最终形成一个依赖网状结构。webpack管理着这些模块的缓存，如果一个模块被require多次，那么只会有一次加载过程，而返回的是缓存的内容，这也是commonjs的规范。

结论
到这里，webpack就hack了commonjs代码。

原理还是很简单的，其实就是实现exports和require，然后自动加载入口模块，控制缓存模块，that's all。