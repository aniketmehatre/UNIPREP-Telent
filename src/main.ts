// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Custom configuration
import { AppComponent } from './app/app.component'; // Your main component

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
