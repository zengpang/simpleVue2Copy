//1.依赖收集器:负责管理watcher
class Dep {
    constructor() {
        this.subs = [];
    }
    // 添加订阅者
    addSub(sub) {
        this.subs.push(sub);
    }
    // 通知所有订阅者更新
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}

//2.观察者:每个属性都有一个Dep,模板中的每个数据绑定都会生成一个Watcher
class Watcher {
    constructor(vm, exp, callback) {
        this.vm = vm;
        this.exp = exp;
        this.callback = callback;
        // 触发 getter，进行依赖收集
        Dep.target = this;
        this.value = this.get
    }
    getVWValue()
    {
        let value=this.getVWValue.$data;
        // 简单处理 exp 如 ’message' 或 'a.b'
        exp=this.exp.split('.');
        exp.forEach(key=>{
            value=value[key];
        });
        return value;
    }
    update()
    {
        let newValue=this.getVWValue();
        this.callback(newValue);
    }
}
//3.vue2 复制类
class Vue {
    constructor(options) {
        this.$el = document.querySelector(options.el);
        this.$data = options.data;
        this.$methods = options.methods;

        // 代理 data,使得可以直接访问
    }

    // 数据劫持核心:使用Object.defineProperty
    _observe(obj)
    {
        Object.keys(obj).forEach
    }
}