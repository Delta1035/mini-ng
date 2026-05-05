import 'zone.js';

import { RenderedComponent } from './runtime';

type Tickable = Pick<RenderedComponent<unknown>, 'tick'>;

export function createAutoTickZone(appRef: Tickable): Zone {
  let scheduled = false;

  const scheduleTick = () => {
    if (scheduled) {
      return;
    }

    scheduled = true;
    Zone.root.run(() => {
      setTimeout(() => {
        scheduled = false;
        appRef.tick();
      }, 0);
    });
  };

  return Zone.current.fork({
    name: 'angular-lite-auto-tick',
    onInvokeTask(delegate, current, target, task, applyThis, applyArgs) {
      try {
        return delegate.invokeTask(target, task, applyThis, applyArgs);
      } finally {
        scheduleTick();
      }
    }
  });
}
