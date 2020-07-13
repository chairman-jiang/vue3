import { isFunction } from "@/helpers/utils";
import { effect, trigger, track } from "./effect";
/**
 * @param {Function | Object} getterOrOptions
 * let obj = reactive({age: 12})
 * computed(() => obj.age + 1)
 * computed也是一个effect
 * @description 计算属性是基于它们的响应式依赖进行缓存的。
 * 只在相关响应式依赖发生改变时它们才会重新求值
 */
export function computed(getterOrOptions) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => {}
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  let dirty = true;
  let value;
  let computed;
  /**
   * 执行会产出activeEffect
   * 在getter中使用的响应式对象会触发proxy-get方法,收集这个正在执行的effect
   * 比如 computed(() => obj.count)
   * 这时只是挂载属性
   */
  const runner = effect(getter, {
    lazy: true,
    computed: true,
    scheduler: () => {
      if (!dirty) {
        dirty = true;
        /**
         * 执行value依赖的effect
        */
        trigger(computed, 'set', 'value')
      }
    }
  })

  /**
   * {
   *   computed -> Map { get value() {} }: {
   *    value -> Set []: [ effect ]
   *  }
   * }
  */
  computed = {
    effect: runner,
    get value() {
      /**
       * 第一次访问直接获取effect返回值
       * 等到里面依赖的值trigger了, 将dirty置为true
       * 这样访问时,就会获取最新的值了
      */
      
      if (dirty) {
        // 执行runner, 产出activeEffect
        value = runner()
        dirty = false
      }
      /**
       * 配合effect函数, 收集依赖.
       * 因为computed不是proxy类型, 不能再之前像访问proxy-get那个自动收集依赖
       * 所以要手动收集一次依赖
       * let val = computed(() obj.count);
       * effect(() => {
       *    val.value 对这个值进行访问, 因为activeEffect存在 触发track
       * })
      */
      
      track(computed, 'get', 'value')
      return value;
    },
    set value(newValue) {
      setter(newValue)
    }
  }

  return computed;
}

