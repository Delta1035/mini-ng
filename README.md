# Angular Signal Demo

This branch simulates an Angular-style app that uses the official signal APIs for automatic change detection.

## What it shows

- `main.ts` bootstraps the app
- `AppComponent` stores state in `signal()`
- `effect()` triggers `tick()` automatically when signal state changes
- the template function still uses the low-level `rf` / instruction style

## Files

- `index.html`: hosts `<app-root>` and loads `src/main.ts`
- `src/main.ts`: entry point, similar to Angular `main.ts`
- `src/signal-bootstrap.ts`: connects Angular signals to automatic tick scheduling
- `src/bootstrap.ts`: minimal component bootstrap
- `src/runtime.ts`: Angular-like `TView` / `TNode` / `LView` and instructions
- `src/app/app.component.ts`: signal-based component state and compiled template function
- `tests/signal.bootstrap.test.ts`: browser-mode Vitest coverage for automatic updates

## Behavior

The app renders:

- `User Name: Zhang San`
- `Age: 20`

After two seconds it mutates the signal state and the DOM updates without a manual `tick()`.

## Scripts

```bash
npm install
npm run dev
npm run test:run
npm run build
```

