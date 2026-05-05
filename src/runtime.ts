export enum RenderFlags {
  Create = 1,
  Update = 2,
}

export type TemplateFn<TContext> = (
  rf: RenderFlags,
  ctx: TContext,
  runtime: IncrementalDomRuntime,
) => void;

export class IncrementalDomRuntime {
  readonly lView: Array<Node | undefined> = [];
  private readonly parentStack: ParentNode[] = [];
  private hasCreated = false;

  patch<TContext>(
    rootEl: ParentNode,
    templateFn: TemplateFn<TContext>,
    ctx: TContext,
  ): void {
    this.parentStack.push(rootEl);
    if (!this.hasCreated) {
      templateFn(RenderFlags.Create, ctx, this);
      this.hasCreated = true;
    }
    templateFn(RenderFlags.Update, ctx, this);
    this.parentStack.pop();
  }

  elementStart(index: number, tag: string): void {
    let el = this.lView[index];

    if (!el) {
      el = document.createElement(tag);
      this.lView[index] = el;

      const parent = this.getCurrentParent();
      if (parent) {
        parent.appendChild(el);
      }
    }

    this.parentStack.push(el as ParentNode);
  }

  elementEnd(): void {
    this.parentStack.pop();
  }

  text(index: number, content: string): void {
    let textNode = this.lView[index];

    if (!textNode) {
      textNode = document.createTextNode(content);
      this.lView[index] = textNode;

      const parent = this.getCurrentParent();
      if (parent) {
        parent.appendChild(textNode);
      }
    } else {
      textNode.textContent = content;
    }
  }

  private getCurrentParent(): ParentNode | null {
    return this.parentStack[this.parentStack.length - 1] ?? null;
  }
}
