import { reactive } from './core'

const obj = reactive({ name: '456' });

obj.name = '123';
