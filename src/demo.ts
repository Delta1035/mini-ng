import { IncrementalDomRuntime } from './runtime';
import { MyTemplate, DemoContext } from './template';

export function mountDemo(appRoot: HTMLElement, output: HTMLElement): IncrementalDomRuntime {
  const runtime = new IncrementalDomRuntime();

  const firstCtx: DemoContext = { name: 'Zhang San', age: 20 };
  runtime.patch(appRoot, MyTemplate, firstCtx);
  output.textContent = [
    'Initial render complete.',
    appRoot.innerHTML
  ].join('\n');

  window.setTimeout(() => {
    const secondCtx: DemoContext = { name: 'Li Si', age: 28 };
    runtime.patch(appRoot, MyTemplate, secondCtx);
    output.textContent = [
      'Updated render complete.',
      appRoot.innerHTML
    ].join('\n');
  }, 2000);

  return runtime;
}
