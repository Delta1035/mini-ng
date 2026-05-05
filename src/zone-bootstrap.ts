import { ComponentType, RenderedComponent } from './runtime';
import { bootstrapApplication } from './bootstrap';
import { createAutoTickZone } from './zone';

export function bootstrapApplicationWithZone<TContext>(
  componentType: ComponentType<TContext>,
  setup: (appRef: RenderedComponent<TContext>) => void
): RenderedComponent<TContext> {
  const appRef = bootstrapApplication(componentType);
  const zoneController = createAutoTickZone(appRef);

  zoneController.zone.run(() => {
    setup(appRef);
  });

  const baseDestroy = appRef.destroy;

  appRef.destroy = () => {
    zoneController.destroy();
    baseDestroy();
  };

  return appRef;
}

