const targetMap = new WeakMap();

export function effect(fn, options) {
  const effect = createReactiveEffect(fn, options)
  // ...
  return effect;
};

const effectOptionsType = {
  lazy: '?boolean',
  computed: '?boolean',
  scheduler: '?void',
  onTrack: '?void',
  onTrigger: '?void',
  onStop: '?void'
};

let uid = 0;
let activeEffect = null;
let effectStack = [];

function createReactiveEffect(fn, options) {
  // ...args 用户传过来的, 解构出来
  const effect = function reactiveEffect(...args) {
    if (!effectStack.includes(effect)) {
      try {
        activeEffect = effect;
        effectStack.push(effect)
        /**
         * 这个return保证外部调用时可以正常运行
         * let result = effect(() => {
         *   return 'pop
         * })
         * 这个result可以取到值
        */
        return fn(...args);
      } finally {
        // try 保证传入的函数可执行, 配合finally做后续事情, 出栈
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1]; // undefined
      }
    }
  }

  effect.options = options;
  effect.row = fn;
  effect.id = uid++;
  effect.deps = [];

  return effect;
}

/**
 * @param {*} target 目标对象 
 * @param {*} type 类型 get has iterate
 * @param {*} key 访问的key
 * @description 收集依赖 在Proxy的get方法调用
 * 先定义一个WeakMap, 被访问的响应式对象全部存入这里
 * targetMap -> WeakMap
 * target 从 proxy get 进来的响应式对象, weakMap存入响应式对象,
 * 通过proxy get 访问的key值存入target这个Map类型中, key: []<Set>
 * 如果当前有effect正在执行, 就将它push到Set里面去, 收集依赖
 * {
 *    {name: 'xu', age: 10}: {
 *      name: [effect, effect],
 *      age: [effect]
 *    }
 *  }
 */

export function track(target, type, key) {
  // 如果当前没有执行的effect, 就不要继续收集依赖了
  if (activeEffect === undefined) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    // 将当前的effect存入这个属性中
    dep.add(activeEffect)
    // 当前是哪个属性依赖了我(effect)
    activeEffect.deps.push(dep)
    // 这是一次双向依赖绑定
  }
}

export function trigger(target, type, key) {
  let computedEffects = new Set()
  let effects = new Set()
  let add = () => {

  }
  if (type === 'clear') {
    
  } else {

  }

}
