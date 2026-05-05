import { bootstrapApplication } from './bootstrap';
import { AppComponent } from './app/app.component';

const appRef = bootstrapApplication(AppComponent);

window.setTimeout(() => {
  appRef.instance.name = 'Li Si';
  appRef.instance.age = 28;
  appRef.tick();
}, 2000);
