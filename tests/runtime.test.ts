import { beforeEach, describe, expect, it } from 'vitest';
import { IncrementalDomRuntime } from '../src/runtime';
import { DemoContext, MyTemplate } from '../src/template';

function createFixture() {
  document.body.innerHTML = '<div id="app"></div>';
  const appRoot = document.getElementById('app');

  if (!appRoot) {
    throw new Error('Fixture root not found.');
  }

  return appRoot;
}

describe('IncrementalDomRuntime', () => {
  let runtime: IncrementalDomRuntime;

  beforeEach(() => {
    runtime = new IncrementalDomRuntime();
  });

  it('creates the DOM structure on first render', () => {
    const appRoot = createFixture();
    const ctx: DemoContext = { name: 'Zhang San', age: 20 };

    runtime.patch(appRoot, MyTemplate, ctx);

    const div = appRoot.querySelector('div');
    const h2 = appRoot.querySelector('h2');
    const p = appRoot.querySelector('p');

    expect(div).not.toBeNull();
    expect(h2?.textContent).toBe('User Name: Zhang San');
    expect(p?.textContent).toBe('Age: 20');
  });

  it('reuses nodes and updates only text content on later renders', () => {
    const appRoot = createFixture();
    const firstCtx: DemoContext = { name: 'Zhang San', age: 20 };

    runtime.patch(appRoot, MyTemplate, firstCtx);

    const firstDiv = appRoot.querySelector('div');
    const firstH2 = appRoot.querySelector('h2');
    const firstP = appRoot.querySelector('p');

    if (!firstDiv || !firstH2 || !firstP) {
      throw new Error('Expected nodes to exist after first render.');
    }

    const secondCtx: DemoContext = { name: 'Li Si', age: 28 };
    runtime.patch(appRoot, MyTemplate, secondCtx);

    expect(appRoot.querySelector('div')).toBe(firstDiv);
    expect(appRoot.querySelector('h2')).toBe(firstH2);
    expect(appRoot.querySelector('p')).toBe(firstP);
    expect(appRoot.querySelector('h2')?.textContent).toBe('User Name: Li Si');
    expect(appRoot.querySelector('p')?.textContent).toBe('Age: 28');
    expect(runtime.lView[0]).toBe(firstDiv);
    expect(runtime.lView[1]).toBe(firstH2);
    expect(runtime.lView[3]).toBe(firstP);
  });
});
