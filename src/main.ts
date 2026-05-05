import { AppComponent } from './app/app.component';
import { bootstrapApplicationWithSignals } from './signal-bootstrap';

void bootstrapApplicationWithSignals(AppComponent).then((appRef) => {
  window.setTimeout(() => {
    appRef.instance.name.set('Li Si');
    appRef.instance.age.set(28);
  }, 2000);
});
