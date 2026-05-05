export interface SimpleChange<T = unknown> {
  previousValue: T;
  currentValue: T;
  firstChange: boolean;
  isFirstChange(): boolean;
}

export type SimpleChanges = Record<string, SimpleChange>;

export interface OnChanges {
  ngOnChanges(changes: SimpleChanges): void;
}

export interface OnInit {
  ngOnInit(): void;
}

export interface DoCheck {
  ngDoCheck(): void;
}

export interface AfterContentInit {
  ngAfterContentInit(): void;
}

export interface AfterContentChecked {
  ngAfterContentChecked(): void;
}

export interface AfterViewInit {
  ngAfterViewInit(): void;
}

export interface AfterViewChecked {
  ngAfterViewChecked(): void;
}

export interface OnDestroy {
  ngOnDestroy(): void;
}

export type LifecycleInstance = Partial<
  OnChanges &
    OnInit &
    DoCheck &
    AfterContentInit &
    AfterContentChecked &
    AfterViewInit &
    AfterViewChecked &
    OnDestroy
>;

export function invokeLifecycleHook<TContext, TKey extends keyof LifecycleInstance>(
  instance: TContext,
  hookName: TKey,
  ...args: unknown[]
): void {
  const hook = (instance as TContext & LifecycleInstance)[hookName];

  if (typeof hook === 'function') {
    hook.apply(instance, args as never[]);
  }
}

