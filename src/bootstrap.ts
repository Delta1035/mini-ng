import {
  ComponentType,
  LView,
  RenderedComponent,
  TView,
  renderComponent,
} from "./runtime";
import { invokeLifecycleHook } from "./lifecycle";

export interface BootstrapOptions {
  hostSelector?: string;
}

export function bootstrapApplication<TContext>(
  componentType: ComponentType<TContext>,
  options: BootstrapOptions = {},
): RenderedComponent<TContext> {
  const def = componentType.cmp;
  const hostSelector = options.hostSelector ?? def.selector;
  const host = document.querySelector<HTMLElement>(hostSelector);

  if (!host) {
    throw new Error(`Host element not found for selector: ${hostSelector}`);
  }

  const instance = new componentType();
  const tView = new TView(def.decls, def.vars, def.template);
  const lView = new LView(host, instance, tView);
  let isInitialized = false;
  let isDestroyed = false;
  const componentRef: RenderedComponent<TContext> = {
    instance,
    host,
    tView,
    lView,
    tick: () => {
      if (isDestroyed) {
        return;
      }

      if (!isInitialized) {
        invokeLifecycleHook(instance, 'ngOnInit');
        invokeLifecycleHook(instance, 'ngDoCheck');
        renderComponent(componentRef);
        invokeLifecycleHook(instance, 'ngAfterContentInit');
        invokeLifecycleHook(instance, 'ngAfterContentChecked');
        invokeLifecycleHook(instance, 'ngAfterViewInit');
        invokeLifecycleHook(instance, 'ngAfterViewChecked');
        isInitialized = true;
        return;
      }

      invokeLifecycleHook(instance, 'ngDoCheck');
      renderComponent(componentRef);
      invokeLifecycleHook(instance, 'ngAfterContentChecked');
      invokeLifecycleHook(instance, 'ngAfterViewChecked');
    },
    destroy: () => {
      if (isDestroyed) {
        return;
      }

      isDestroyed = true;
      invokeLifecycleHook(instance, 'ngOnDestroy');
    },
  };
  return componentRef;
}
