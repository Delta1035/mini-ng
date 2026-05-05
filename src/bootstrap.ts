import {
  ComponentType,
  LView,
  RenderedComponent,
  TView,
  renderComponent,
} from "./runtime";

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
  const componentRef: RenderedComponent<TContext> = {
    instance,
    host,
    tView,
    lView,
    tick: () => renderComponent(componentRef),
  };

  renderComponent(componentRef);
  return componentRef;
}
