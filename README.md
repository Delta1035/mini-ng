# Incremental DOM Demo

This repo now uses Vite + TypeScript + Vitest browser mode.

## What it demonstrates

- a tiny incremental DOM runtime
- a template function in the style of Angular Render3 output
- node reuse through indexed slots
- text-only updates on later renders

## Project layout

- `index.html`: Vite entry page
- `src/runtime.ts`: minimal runtime that stores nodes in `lView`
- `src/template.ts`: the template function and context type
- `src/demo.ts`: browser demo bootstrap
- `src/main.ts`: Vite entry module
- `tests/runtime.test.ts`: browser-mode Vitest coverage for creation and update behavior

## Angular mapping

- `TView`: shared static blueprint
- `TNode`: static metadata for each node
- `LView`: runtime state for one view instance

This demo keeps only the runtime part and removes the separate static metadata layer, so the code stays small enough to inspect directly.

Vitest runs these tests in a real browser via the `preview` provider, not in jsdom.

## Scripts

Install dependencies first:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Run tests:

```bash
npm run test:run
```

Build for production:

```bash
npm run build
```
