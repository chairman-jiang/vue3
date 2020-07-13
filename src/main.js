import { reactive, computed } from './core'

const obj = reactive({ name: '456', age: 10, friends: ['tom', 'chris'] });

const val = computed(() => obj.age + 1)

setTimeout(() => {
  console.log(val.value, 'val')
}, 1000);