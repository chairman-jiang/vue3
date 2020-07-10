import { reactive, effect } from './core'

const obj = reactive({ name: '456', age: 10 });

effect(() => {
  console.log(obj.name, 'value')
  console.log('触发effect');
})

setTimeout(() => {
  obj.name = '请问'
  console.log('timeout')
}, 1000);
