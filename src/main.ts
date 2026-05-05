import { mountDemo } from './demo';

const appRoot = document.querySelector<HTMLElement>('#app');
const output = document.querySelector<HTMLElement>('#test-output');

if (!appRoot || !output) {
  throw new Error('Required demo elements are missing.');
}

mountDemo(appRoot, output);
