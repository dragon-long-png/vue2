// vue响应式原理
const data = {
    name: 'Lucky',
    age: 18,
    son: {
        name: 'jack',
        age: 2
    },
    arr: [1, 2, 3]
}
let arrayProto = Array.prototype;
// 复制一个，防止污染Array.prototype中函数
let arrayMethod = Object.create(arrayProto);
// 数组改写的变异方法，用来针对数组响应式
['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'].forEach(item => {
    arrayMethod[item] = function () {
        arrayMethod[item].call(this, ...arguments);
        render();
    }
})


function render() {
    console.log('响应式触发，页面渲染');
}

function definePro(data, key, value) {
    // 如果子属性是对象的话则进行递归
    observer(value);
    Object.defineProperty(data, key, {
        // 获取  读
        get() {
            return value;
        },
        // 设置  写
        set(newVal) {
            if (newVal === value) {
                return
            }
            value = newVal;
            render();
        }
    })
}

function observer(data) {
    // 如果是数组，则用数组变异方法
    if (Array.isArray(data)) {
        data.__proto__ = arrayMethod;
        return;
    }
    // 如果是对象，则用Object.defineProperty
    if (typeof data === 'object') {
        for (let key in data) {
            definePro(data, key, data[key])
        }
    }
}
observer(data);