// .给出如下虚拟dom的数据结构，如何实现简单的虚拟dom，渲染到目标dom树
//样例数据
// let demoNode = ({
//     tagName: 'ul',
//     props: {'class': 'list'},
//     children: [
//         ({tagName: 'li', children: ['douyin']}),
//         ({tagName: 'li', children: ['toutiao']})
//     ]
// });


// 思路：
//构建一个render函数，将demoNode对象渲染为以下dom
/* <ul class="list">
    <li>douyin</li>
    <li>toutiao</li>
</ul> */

// 1.构建element函数
function Element({tagName, props, children}){
    if(!(this instanceof Element)){
        return new Element({tagName, props, children})
    }
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
}
// 2.render函数
Element.prototype.render = function(){
    var el = document.createElement(this.tagName),
        props = this.props,
        propName,
        propValue;
    for(propName in props){
        propValue = props[propName];
        el.setAttribute(propName, propValue);
    }
    this.children.forEach(function(child){
        var childEl = null;
        if(child instanceof Element){
            childEl = child.render();
        }else{
            childEl = document.createTextNode(child);
        }
        el.appendChild(childEl);
    });
    return el;
};


// 使用
var elem = Element({
    tagName: 'ul',
    props: {'class': 'list'},
    children: [
        Element({tagName: 'li', children: ['item1']}),
        Element({tagName: 'li', children: ['item2']})
    ]
});
document.querySelector('body').appendChild(elem.render());