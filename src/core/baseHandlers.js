import { isObject } from "@/helpers/utils";
import { reactive } from "./reactive";

function createGetter() {
  return function get(target, propKey, receiver) {
    const result = Reflect.get(target, propKey, receiver);
    if (isObject(result)) {
      return reactive(result)
    }
    console.log('getter', target, propKey);
    return result;
  }
}

function createSetter() {
  return function set(target, propKey, value, receiver) {
    const hadKey = Reflect.has(target, propKey);
    const oldValue = Reflect.get(target, propKey);
    const result = Reflect.set(target, propKey, value, receiver);
    if (!hadKey) {
      console.log('新增属性')
    } else if (oldValue !== value) {
      console.log('修改');
    }
    console.log('setter', target, propKey, value);
    return result;
  }
}

const get = createGetter();
const set = createSetter();

export const mutableHandle = {
  get,
  set
};
