import '@angular/compiler';

import {
  effect,
  importProvidersFrom,
  ɵinternalCreateApplication,
  provideZonelessChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { bootstrapApplication } from './bootstrap';
import { ComponentType, RenderedComponent } from './runtime';

export async function bootstrapApplicationWithSignals<TContext>(
  componentType: ComponentType<TContext>,
  options: { hostSelector?: string } = {}
): Promise<RenderedComponent<TContext>> {
  const appRef = bootstrapApplication(componentType, options);

  const angularApp = await ɵinternalCreateApplication({
    appProviders: [
      importProvidersFrom(BrowserModule),
      provideZonelessChangeDetection(),
    ],
  });

  const effectRef = runInInjectionContext(angularApp.injector, () =>
    effect(() => {
      appRef.tick();
    }, { injector: angularApp.injector })
  );

  appRef.tick();

  const baseDestroy = appRef.destroy;

  appRef.destroy = () => {
    effectRef.destroy();
    baseDestroy();
  };

  return appRef;
}

