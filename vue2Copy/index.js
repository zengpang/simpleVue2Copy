//1.依赖收集器:负责管理watcher
class Dep {
    constructor() {
        // subs 是 subscribers （订阅者）的缩写，用来存放所有Watcher对象
        this.subs = [];
    }
    // 添加订阅者:当有地方用到了这个数据，就调用这个方法把自己(Watcher)加进来
    addSub(sub) {
        this.subs.push(sub);
    }
    // 通知更新:当数据发生改变时，
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}

//2.观察者:每个属性都有一个Dep,模板中的每个数据绑定都会生成一个Watcher
class Watcher {
    // 参数:vm=Vue实例，exp=表达式(如'message'),callback=更新DOM的回调函数
    constructor(vm, exp, callback) {
        this.vm = vm;
        this.exp = exp;
        this.callback = callback;

        // 【关键步骤1】依赖收集
        // Dep.target 是一个全局静态变量,用来标记"当前正在创建的这个Watcher"
        Dep.target = this;

        // 【关键步骤 2】触发 getter
        // 这里故意读取一下属性值。这会触发Vue数据中的get()函数。
        // 在 get() 函数里，会判断Dep.target 是否存在，如果存在，就把这个
        this.value = this.getVWValue();

        // 【关键步骤 3】清空标记
        // 收集完毕，把全局变量置空，以免影响其他Watcher的收集
        Dep.target = null;
    }
    getVWValue() {
        let value = this.vm.$data;
        // 简单处理 exp 如 ’message' 或 'a.b'
        exp = this.exp.split('.');
        exp.forEach(key => {
            value = value[key];
        });
        return value;
    }

    // 更新方法:当Dep.notify 被调用时，会执行这个方法
    update() {
        //1.获取最新的值
        let newValue = this.getVWValue();
        //2.执行回调函数(通常是更新DOM文本或Input的value)
        this.callback(newValue);
    }
}
//3.vue2 复制类
class Vue {
    constructor(options) {
        // 获取用户传入的配置项
        this.$el = document.querySelector(options.el);
        this.$data = options.data;
        this.$methods = options.methods;

        // 1.数据代理
        // 让我们可以通过this.message 访问，而不是this.$data.message
        this._pro
    }

    // 数据劫持核心:使用Object.defineProperty
    // 接受一个要被观察的对象
    _observe(obj) {
        // 遍历对象的所有属性
        Object.keys(obj).forEach(key => {
            let value = obj[key];//暂存当前属性值，防止死循环
            let dep = new Dep();//为每个属性创建一个专属的“管家”(Dep)
            /**
             * Object.defineProperty(obj,prop,descriptor)
             * obj:要操作的目标对象。
             * prop:要定义或修改的属性名(字符串类型)。
             * descriptor:属性描述符对象。这是一个核心配置项，用来定义该属性的特性
             */
            Object.defineProperty(obj, key, {
                configurable: true,
                enumerable: true,
                // get拦截器:当有人读取属性时执行
                get() {
                    // 【关键】如果此时全局的Dep.target有值（说明正在创建Watcher）
                    // 依赖收集:如果此时有Watcher，把它添加到dep数组里。
                    if (Dep.target) {
                        dep.addSub(Dep.target);
                    }
                    return value;
                },
                // set 拦截器:当有人修改属性时执行
                set(newVal) {
                    // 如果数值和旧值一样,就不处理，节省性能
                    if(value===newVal) return;

                    //更新值
                    value=newVal;

                    //【关键】通知所有订阅了这个属性的Watcher:数据变了,快更新！
                    dep.notify();
                }
            })
        })
    }

    //接受一个DOM元素
    _compile(el){
        // 获取所有子节点(包括文本节点，元素节点等)
        let nodes=el.childNodes;
        
    }
}