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


function render() {
    console.log('响应式触发，页面渲染');
}

let arrayProto = Array.prototype;
// 复制一个，防止污染Array.prototype中函数
let arrayMethod = Object.create(arrayProto);
// 数组改写的变异方法，用来针对数组响应式
['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'].forEach(function (item) {
    arrayMethod[item] = function () {
        arrayProto[item].call(this, ...arguments);
        render();
    }
})

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

/**
 * 
 * @param {*} data 要改谁
 * @param {*} key 要改的属性
 * @param {*} value 改成什么
 */
function $set(data, key, value) {
    // 数组
    if (Array.isArray(data)) {
        data.splice(key, 1, value)
        return value;
    }
    // 对象
    definePro(data, key, value);
    render();
    return value;
}


/**
 * 
 * @param {*} data  删除谁 
 * @param {*} key 删除哪个属性
 */
function $delete(data, key) {
    // 数组
    if (Array.isArray(data)) {
        data.splice(key, 1);
        return;
    }
    // 对象
    delete data[key];
    render();
}

observer(data);