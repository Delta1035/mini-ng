import 'zone.js';

import { RenderedComponent } from './runtime';

type Tickable = Pick<RenderedComponent<unknown>, 'tick'>;

export interface AutoTickZoneController {
  zone: Zone;
  destroy: () => void;
}

export function createAutoTickZone(appRef: Tickable): AutoTickZoneController {
  let scheduled = false;
  let destroyed = false;
  let sawAsyncTask = false;

  const scheduleTick = () => {
    if (scheduled || destroyed) {
      return;
    }

    scheduled = true;
    Zone.root.run(() => {
      setTimeout(() => {
        scheduled = false;

        if (!destroyed) {
          appRef.tick();
        }
      }, 0);
    });
  };

  const zone = Zone.current.fork({
    name: 'angular-lite-auto-tick',
    onHasTask(delegate, current, target, hasTaskState) {
      delegate.hasTask(target, hasTaskState);

      if (hasTaskState.macroTask || hasTaskState.microTask) {
        sawAsyncTask = true;
        return;
      }

      if (sawAsyncTask) {
        scheduleTick();
      }
    },
    onInvokeTask(delegate, current, target, task, applyThis, applyArgs) {
      return delegate.invokeTask(target, task, applyThis, applyArgs);
    }
  });

  return {
    zone,
    destroy: () => {
      destroyed = true;
      scheduled = false;
    }
  };
}

