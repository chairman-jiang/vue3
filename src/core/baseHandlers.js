import { isObject } from "@/helpers/utils";
import { reactive } from "./reactive";
import { trigger, track } from "./effect";

function createGetter() {
  return function get(target, propKey, receiver) {
    const result = Reflect.get(target, propKey, receiver);
    track(target, 'add' , propKey)
    // 访问内部属性.如果依然的对象就继续代理
    if (isObject(result)) {
      return reactive(result)
    }
    // console.log('getter', target, propKey, 'get');
    return result;
  }
}

function createSetter() {
  return function set(target, propKey, value, receiver) {
    const hadKey = Reflect.has(target, propKey);
    const oldValue = Reflect.get(target, propKey);
    const result = Reflect.set(target, propKey, value, receiver);
    if (!hadKey) {
      // console.log('新增属性')
      trigger(target, 'add', propKey, value)
    } else if (oldValue !== value) {
      // console.log('修改');
      trigger(target, 'set', propKey, value)
    }
    // console.log('setter', target, propKey, value);
    return result;
  }
}

const get = createGetter();
const set = createSetter();

export const mutableHandle = {
  get,
  set
};
