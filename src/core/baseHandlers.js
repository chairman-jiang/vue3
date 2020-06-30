function createGetter () {
  return function get(target, propKey, receiver) {
    const result = Reflect.get(target, propKey, receiver);
    console.log('getter', target, propKey);
    return result;
  }
}

function createSetter() {
  return function set(target, propKey, value, receiver) {
    const result = Reflect.set(target, propKey, value, receiver);
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
