import { isObject } from '@/helpers/utils'
import { mutableHandle } from './baseHandlers';

export function reactive(target) {
  return createReactiveObject(target, mutableHandle)
}

function createReactiveObject(target, baseHandler) {
  if (!isObject(target)) {
    return target
  }
  const observed = new Proxy(target, baseHandler);
  return observed
}
