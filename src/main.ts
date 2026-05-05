import { AppComponent } from './app/app.component';
import { bootstrapApplicationWithZone } from './zone-bootstrap';

bootstrapApplicationWithZone(AppComponent, (appRef) => {
  window.setTimeout(() => {
    appRef.instance.name = 'Li Si';
    appRef.instance.age = 28;
  }, 2000);
});

