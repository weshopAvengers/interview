babel 编译时只转换语法，几乎可以编译所有时新的 JavaScript 语法，但并不会转化BOM里面不兼容的API
比如 Promise,Set,Symbol,Array.from,async 等等的一些API
这时候就需要 polyfill 来转转化这些API

babel 转译语法需要一些plugin
如 react,es2015,stage-0,stage-1等等
其中的 es2015 表示 babel会加载 es6 相关的编译模块，然后 stage-0 表示的是什么呢？
stage 系列集合了一些对 es7 的草案支持的插件，由于是草案，所以作为插件的形式提供。
    
    * stage-0 - Strawman: just an idea, possible Babel plugin.
    * stage-1 - Proposal: this is worth working on.
    * stage-2 - Draft: initial spec.
    * stage-3 - Candidate: complete spec and initial browser implementations.
    * stage-4 - Finished: will be added to the next yearly release.
stage 是向下兼容 0>1>2>3>4 所包含的插件数量依次减少

babel polyfill 有三种：
    
    * babel-runtime
    * babel-plugin-transform-runtime
    * babel-polyfill
transform-runtime
在使用webpack打包时，需配置到babel中
    
    "plugins": [
            ["transform-runtime", {
                    "helpers": false,
                    "polyfill": false,
                    "regenerator": true,
                    "moduleName": "babel-runtime"
            }]
    ]
transform-runtime 会有几个配置项，不表标注默认为true

在webpack中，babel-plugin-transform-runtime 实际上是依赖babel-runtime
因为babel编译es6到es5的过程中，babel-plugin-transform-runtime这个插件会自动polyfill es5不支持的特性，
这些polyfill包就是在babel-runtime这个包里
core-js 、regenerator等 poiiyfill

babel-runtime和 babel-plugin-transform-runtime的区别是，相当一前者是手动挡而后者是自动挡，每当要转译一个api时都要手动加上require('babel-runtime')，
而babel-plugin-transform-runtime会由工具自动添加，主要的功能是为api提供沙箱的垫片方案，不会污染全局的api，因此适合用在第三方的开发产品中。

runtime转换器插件主要做了三件事：
    
    * 当你使用generators/async方法、函数时自动调用babel-runtime/regenerator
    * 当你使用ES6 的Map或者内置的东西时自动调用babel-runtime/core-js
    * 移除内联babel helpers并替换使用babel-runtime/helpers来替换
    transform-runtime优点
    
    * 不会污染全局变量
    * 多次使用只会打包一次
    * 依赖统一按需引入,无重复引入,无多余引入
transform-runtime缺点
    
    * 不支持实例化的方法Array.includes(x) 就不能转化
    * 如果使用的API用的次数不是很多，那么transform-runtime 引入polyfill的包会比不是transform-runtime 时大
总的来说一句话，你可以使用内置的一些东西例如Promise,Set,Symbol等，就像使用无缝的使用polyfill,来使用babel 特性，并且无全局污染、极高代码库适用性。
虽然这种方法的优点是不会污染全局，但是，实例的方法，
Array.prototype.includes();

babel-polyfill
babel-polyfill则是通过改写全局prototype的方式实现，比较适合单独运行的项目。
开启babel-polyfill的方式，可以直接在代码中require，或者在webpack的entry中添加，也可以在babel的env中设置useBuildins为true来开启。
但是babel-polyfill会有近100K，
打包后代码冗余量比较大，
对于现代的浏览器,有些不需要polyfill，造成流量浪费
污染了全局对象