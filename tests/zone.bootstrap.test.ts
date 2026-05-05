import { describe, expect, it } from 'vitest';
import { bootstrapApplicationWithZone } from '../src/zone-bootstrap';
import { AppComponent } from '../src/app/app.component';

function createFixture() {
  document.body.innerHTML = '<app-root></app-root>';
  const host = document.querySelector('app-root');

  if (!host) {
    throw new Error('Fixture host not found.');
  }

  return host;
}

describe('zone bootstrap', () => {
  it('automatically triggers change detection after async work', async () => {
    createFixture();

    const appRef = bootstrapApplicationWithZone(AppComponent, (ref) => {
      window.setTimeout(() => {
        ref.instance.name = 'Li Si';
        ref.instance.age = 28;
      }, 0);
    });

    expect(document.querySelector('h2')?.textContent).toBe('User Name: Zhang San');

    await new Promise((resolve) => window.setTimeout(resolve, 30));

    expect(document.querySelector('h2')?.textContent).toBe('User Name: Li Si');
    expect(document.querySelector('p')?.textContent).toBe('Age: 28');
    expect(appRef.lView.nodes[0]?.nodeName.toLowerCase()).toBe('section');

    appRef.destroy();
    appRef.instance.name = 'Wang Wu';
    appRef.tick();

    expect(document.querySelector('h2')?.textContent).toBe('User Name: Li Si');
  });
});

