# Angular Lite Zone Demo

This branch simulates a small Angular-style application flow driven by ZoneJS:

- `main.ts` bootstraps the app
- `AppComponent` holds state
- the compiled template function uses `rf` flags and low-level instructions
- `TView` stores static metadata
- `LView` stores runtime DOM nodes
- a custom Zone watches async tasks and schedules `tick()`

## Files

- `index.html`: hosts `<app-root>` and loads `src/main.ts`
- `src/main.ts`: bootstrap entry, similar to Angular `main.ts`
- `src/bootstrap.ts`: tiny `bootstrapApplication`
- `src/zone.ts`: creates the auto-tick Zone wrapper
- `src/zone-bootstrap.ts`: connects Zone scheduling to component bootstrap
- `src/runtime.ts`: Angular-like `TView` / `TNode` / `LView` and instructions
- `src/app/app.component.ts`: component class plus compiled template function
- `tests/zone.bootstrap.test.ts`: browser-mode Vitest coverage for async updates

## Behavior

The app renders:

- `User Name: Zhang San`
- `Age: 20`

After two seconds it mutates the component instance inside a Zone-tracked async task.
When the task queue settles, the zone schedules a `tick()`, and the DOM updates while reusing the same nodes.

## Scripts

```bash
npm install
npm run dev
npm run test:run
npm run build
```

