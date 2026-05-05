export enum RenderFlags {
  Create = 1,
  Update = 2
}

export type TemplateFn<TContext> = (rf: RenderFlags, ctx: TContext, lView: LView<TContext>) => void;

export type TNodeType = 'element' | 'text';

export interface TNode {
  index: number;
  type: TNodeType;
  tagName?: string;
  parentIndex: number | null;
}

export interface ComponentDef<TContext> {
  selector: string;
  decls: number;
  vars: number;
  template: TemplateFn<TContext>;
}

export type ComponentType<TContext> = {
  new(): TContext;
  cmp: ComponentDef<TContext>;
};

export interface RenderedComponent<TContext> {
  instance: TContext;
  host: ParentNode;
  tView: TView<TContext>;
  lView: LView<TContext>;
  tick: () => void;
  destroy: () => void;
}

export function defineComponent<TContext>(def: ComponentDef<TContext>): ComponentDef<TContext> {
  return def;
}

export class TView<TContext> {
  readonly data: Array<TNode | undefined>;
  firstCreatePass = true;

  constructor(
    public readonly decls: number,
    public readonly vars: number,
    public readonly template: TemplateFn<TContext>
  ) {
    this.data = new Array(decls + vars);
  }
}

export class LView<TContext> {
  readonly nodes: Array<Node | undefined> = [];
  readonly parentStack: ParentNode[] = [];
  readonly tNodeStack: number[] = [];

  constructor(
    public readonly host: ParentNode,
    public readonly context: TContext,
    public readonly tView: TView<TContext>
  ) {}
}

export function createTNode(
  lView: LView<unknown>,
  index: number,
  type: TNodeType,
  tagName?: string
): TNode {
  const parentIndex = lView.tNodeStack[lView.tNodeStack.length - 1] ?? null;
  const existing = lView.tView.data[index];

  if (existing) {
    return existing;
  }

  const tNode: TNode = { index, type, tagName, parentIndex };
  lView.tView.data[index] = tNode;
  return tNode;
}

export function ngElementStart<TContext>(lView: LView<TContext>, index: number, tagName: string): void {
  if (lView.tView.firstCreatePass) {
    createTNode(lView as LView<unknown>, index, 'element', tagName);
  }

  let node = lView.nodes[index];

  if (!node) {
    node = document.createElement(tagName);
    lView.nodes[index] = node;

    const parent = getCurrentParent(lView);
    if (parent) {
      parent.appendChild(node);
    }
  }

  lView.parentStack.push(node as ParentNode);
  lView.tNodeStack.push(index);
}

export function ngElementEnd<TContext>(lView: LView<TContext>): void {
  lView.parentStack.pop();
  lView.tNodeStack.pop();
}

export function ngText<TContext>(lView: LView<TContext>, index: number, value: string): void {
  if (lView.tView.firstCreatePass) {
    createTNode(lView as LView<unknown>, index, 'text');
  }

  let node = lView.nodes[index];

  if (!node) {
    node = document.createTextNode(value);
    lView.nodes[index] = node;

    const parent = getCurrentParent(lView);
    if (parent) {
      parent.appendChild(node);
    }
  } else {
    node.textContent = value;
  }
}

export function ngTextInterpolate<TContext>(
  lView: LView<TContext>,
  index: number,
  value: string
): void {
  ngText(lView, index, value);
}

export function renderComponent<TContext>(componentRef: RenderedComponent<TContext>): void {
  const { lView, tView } = componentRef;

  lView.parentStack.push(lView.host);

  if (tView.firstCreatePass) {
    tView.template(RenderFlags.Create, lView.context, lView);
    tView.firstCreatePass = false;
  }

  tView.template(RenderFlags.Update, lView.context, lView);

  lView.parentStack.pop();
}

function getCurrentParent<TContext>(lView: LView<TContext>): ParentNode | null {
  return lView.parentStack[lView.parentStack.length - 1] ?? null;
}
