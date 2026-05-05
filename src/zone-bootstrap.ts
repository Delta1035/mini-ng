import { ComponentType, RenderedComponent } from './runtime';
import { bootstrapApplication } from './bootstrap';
import { createAutoTickZone } from './zone';

export function bootstrapApplicationWithZone<TContext>(
  componentType: ComponentType<TContext>,
  setup: (appRef: RenderedComponent<TContext>) => void
): RenderedComponent<TContext> {
  const appRef = bootstrapApplication(componentType);
  const zone = createAutoTickZone(appRef);

  zone.run(() => {
    setup(appRef);
  });

  return appRef;
}

