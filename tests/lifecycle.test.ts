import { signal } from '@angular/core';
import { describe, expect, it } from 'vitest';

import { bootstrapApplicationWithSignals } from '../src/signal-bootstrap';
import {
  defineComponent,
  LView,
  RenderFlags,
  ngElementEnd,
  ngElementStart,
  ngText,
  ngTextInterpolate,
} from '../src/runtime';

class LifecycleComponent {
  static cmp = defineComponent<LifecycleComponent>({
    selector: 'life-root',
    decls: 3,
    vars: 1,
    template: LifecycleComponent_Template,
  });

  readonly label = signal('ready');
  readonly events: string[] = [];

  ngOnInit(): void {
    this.events.push('ngOnInit');
  }

  ngDoCheck(): void {
    this.events.push('ngDoCheck');
  }

  ngAfterContentInit(): void {
    this.events.push('ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    this.events.push('ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    this.events.push('ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    this.events.push('ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    this.events.push('ngOnDestroy');
  }
}

function LifecycleComponent_Template(
  rf: RenderFlags,
  ctx: LifecycleComponent,
  lView: LView<LifecycleComponent>
): void {
  if (rf & RenderFlags.Create) {
    ngElementStart(lView, 0, 'div');
    ngText(lView, 1, '');
    ngElementEnd(lView);
  }

  if (rf & RenderFlags.Update) {
    ngTextInterpolate(lView, 1, `Status: ${ctx.label()}`);
  }
}

function createFixture(): void {
  document.body.innerHTML = '<life-root></life-root>';
}

describe('lifecycle bootstrap', () => {
  it('runs the component lifecycle hooks in order and destroys cleanly', async () => {
    createFixture();

    const appRef = await bootstrapApplicationWithSignals(LifecycleComponent);

    expect(document.querySelector('div')?.textContent).toBe('Status: ready');
    expect(appRef.instance.events).toEqual([
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
    ]);

    appRef.instance.label.set('updated');

    await new Promise((resolve) => window.setTimeout(resolve, 30));

    expect(document.querySelector('div')?.textContent).toBe('Status: updated');
    expect(appRef.instance.events).toEqual([
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
      'ngDoCheck',
      'ngAfterContentChecked',
      'ngAfterViewChecked',
    ]);

    appRef.destroy();

    expect(appRef.instance.events).toEqual([
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
      'ngDoCheck',
      'ngAfterContentChecked',
      'ngAfterViewChecked',
      'ngOnDestroy',
    ]);
  });
});

