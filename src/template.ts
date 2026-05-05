import { IncrementalDomRuntime, RenderFlags } from './runtime';

export interface DemoContext {
  name: string;
  age: number;
}

export function MyTemplate(rf: RenderFlags, ctx: DemoContext, runtime: IncrementalDomRuntime): void {
  if (rf & RenderFlags.Create) {
    runtime.elementStart(0, 'div');
    runtime.elementStart(1, 'h2');
    runtime.text(2, '');
    runtime.elementEnd();
    runtime.elementStart(3, 'p');
    runtime.text(4, '');
    runtime.elementEnd();
    runtime.elementEnd();
  }

  if (rf & RenderFlags.Update) {
    runtime.text(2, `User Name: ${ctx.name}`);
    runtime.text(4, `Age: ${ctx.age}`);
  }
}
