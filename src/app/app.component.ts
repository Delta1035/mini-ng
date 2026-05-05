import {
  ComponentDef,
  RenderFlags,
  defineComponent,
  LView,
  ngElementEnd,
  ngElementStart,
  ngText,
  ngTextInterpolate,
} from "../runtime";

export class AppComponent {
  static cmp: ComponentDef<AppComponent>;

  name = "Zhang San";
  age = 20;
}

export function AppComponent_Template(
  rf: RenderFlags,
  ctx: AppComponent,
  lView: LView<AppComponent>,
): void {
  if (rf & RenderFlags.Create) {
    ngElementStart(lView, 0, "section");
    ngElementStart(lView, 1, "h2");
    ngText(lView, 2, "");
    ngElementEnd(lView);
    ngElementStart(lView, 3, "p");
    ngText(lView, 4, "");
    ngElementEnd(lView);
    ngElementEnd(lView);
  }

  if (rf & RenderFlags.Update) {
    ngTextInterpolate(lView, 2, `User Name: ${ctx.name}`);
    ngTextInterpolate(lView, 4, `Age: ${ctx.age}`);
  }
}

AppComponent.cmp = defineComponent<AppComponent>({
  selector: "app-root",
  decls: 5,
  vars: 2,
  template: AppComponent_Template,
});
