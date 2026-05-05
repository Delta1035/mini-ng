import { beforeEach, describe, expect, it } from 'vitest';
import { bootstrapApplication } from '../src/bootstrap';
import { AppComponent } from '../src/app/app.component';

function createFixture() {
  document.body.innerHTML = '<app-root></app-root>';
  const host = document.querySelector('app-root');

  if (!host) {
    throw new Error('Fixture host not found.');
  }

  return host;
}

describe('AppComponent bootstrap', () => {
  beforeEach(() => {
    createFixture();
  });

  it('renders the component using Angular-like bootstrap flow', () => {
    const appRef = bootstrapApplication(AppComponent);

    const section = document.querySelector('section');
    const heading = document.querySelector('h2');
    const paragraph = document.querySelector('p');

    expect(section).not.toBeNull();
    expect(heading?.textContent).toBe('User Name: Zhang San');
    expect(paragraph?.textContent).toBe('Age: 20');
    expect(appRef.tView.firstCreatePass).toBe(false);
    expect(appRef.tView.data[0]?.type).toBe('element');
    expect(appRef.tView.data[1]?.tagName).toBe('h2');
    expect(appRef.tView.data[4]?.type).toBe('text');
  });

  it('updates the same DOM nodes after state mutation and tick', () => {
    const appRef = bootstrapApplication(AppComponent);
    const firstSection = document.querySelector('section');
    const firstHeading = document.querySelector('h2');
    const firstParagraph = document.querySelector('p');

    if (!firstSection || !firstHeading || !firstParagraph) {
      throw new Error('Expected nodes to exist after bootstrap.');
    }

    appRef.instance.name = 'Li Si';
    appRef.instance.age = 28;
    appRef.tick();

    expect(document.querySelector('section')).toBe(firstSection);
    expect(document.querySelector('h2')).toBe(firstHeading);
    expect(document.querySelector('p')).toBe(firstParagraph);
    expect(document.querySelector('h2')?.textContent).toBe('User Name: Li Si');
    expect(document.querySelector('p')?.textContent).toBe('Age: 28');
    expect(appRef.lView.nodes[0]).toBe(firstSection);
    expect(appRef.lView.nodes[1]).toBe(firstHeading);
    expect(appRef.lView.nodes[3]).toBe(firstParagraph);
  });
});
