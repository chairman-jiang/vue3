import { reactive, effect } from './core'

const obj = reactive({ name: '456', age: 10 });

effect(() => {
  console.log(obj.name, 'effect');
})

effect(() => {
  console.log(obj.name, 'effect2');
})

setTimeout(() => {
  obj.name = '请问'
  console.log('timeout')
}, 3000);

// setTimeout(() => {
//   console.log(obj.name, 'name');
// }, 3000)
