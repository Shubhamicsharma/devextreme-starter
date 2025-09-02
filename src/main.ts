import themes from 'devextreme/ui/themes';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { licenseKey } from './devextreme-license'; // Import the license key
import config from 'devextreme/core/config';

config({
    licenseKey: licenseKey,
});

themes.initialized(() => {
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
        console.error(err),
    );
});
