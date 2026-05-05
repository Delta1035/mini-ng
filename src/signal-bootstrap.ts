import '@angular/compiler';

import { effect, importProvidersFrom, ɵinternalCreateApplication, provideZonelessChangeDetection, runInInjectionContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ComponentType, RenderedComponent } from './runtime';
import { bootstrapApplication } from './bootstrap';

type OnInitHook = {
  ngOnInit?: () => void;
};

export async function bootstrapApplicationWithSignals<TContext>(
  componentType: ComponentType<TContext>,
  options: { hostSelector?: string } = {}
): Promise<RenderedComponent<TContext>> {
  const appRef = bootstrapApplication(componentType, options);

  const angularApp = await ɵinternalCreateApplication({
    appProviders: [
      importProvidersFrom(BrowserModule),
      provideZonelessChangeDetection()
    ]
  });

  runInInjectionContext(angularApp.injector, () => {
    effect(() => {
      appRef.tick();
    }, { injector: angularApp.injector });
  });

  const onInit = (appRef.instance as TContext & OnInitHook).ngOnInit;

  if (typeof onInit === 'function') {
    onInit.call(appRef.instance);
  }

  return appRef;
}
