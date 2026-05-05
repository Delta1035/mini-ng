# Angular Lite Demo

This repo now simulates a small Angular-style application flow:

- `main.ts` bootstraps the app
- `AppComponent` holds state
- the compiled template function uses `rf` flags and low-level instructions
- `TView` stores static metadata
- `LView` stores runtime DOM nodes

## Files

- `index.html`: hosts `<app-root>` and loads `src/main.ts`
- `src/main.ts`: bootstrap entry, similar to Angular `main.ts`
- `src/bootstrap.ts`: tiny `bootstrapApplication`
- `src/runtime.ts`: Angular-like `TView` / `TNode` / `LView` and instructions
- `src/app/app.component.ts`: component class plus compiled template function
- `tests/app.component.test.ts`: browser-mode Vitest coverage

## Behavior

The app renders:

- `User Name: Zhang San`
- `Age: 20`

After two seconds it mutates the component instance and runs change detection again, reusing the same DOM nodes and only updating text content.

## Scripts

```bash
npm install
npm run dev
npm run test:run
npm run build
```
