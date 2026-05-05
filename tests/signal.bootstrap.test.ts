import { describe, expect, it } from 'vitest';
import { bootstrapApplicationWithSignals } from '../src/signal-bootstrap';
import { AppComponent } from '../src/app/app.component';

function createFixture() {
  document.body.innerHTML = '<app-root></app-root>';
  const host = document.querySelector('app-root');

  if (!host) {
    throw new Error('Fixture host not found.');
  }

  return host;
}

describe('signal bootstrap', () => {
  it('updates the DOM automatically when signal state changes', async () => {
    createFixture();

    const appRef = await bootstrapApplicationWithSignals(AppComponent);

    expect(document.querySelector('h2')?.textContent).toBe('User Name: Zhang San');
    expect(document.querySelector('p')?.textContent).toBe('Age: 20');

    appRef.instance.name.set('Li Si');
    appRef.instance.age.set(28);

    await new Promise((resolve) => window.setTimeout(resolve, 30));

    expect(document.querySelector('h2')?.textContent).toBe('User Name: Li Si');
    expect(document.querySelector('p')?.textContent).toBe('Age: 28');
    expect(appRef.instance.name()).toBe('Li Si');
    expect(appRef.instance.age()).toBe(28);
  });
});
