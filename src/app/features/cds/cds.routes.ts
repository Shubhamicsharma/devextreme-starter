import { Routes } from '@angular/router';
import { CDSOptionsComponent } from './cdsOptions/cds-options.component';
import { CDSStepperComponent } from './cds-stepper/cds-stepper.component';
import { AllocationFormComponent } from './allocation-form/allocation-form.component';
import { CDSDemoComponent } from './cds-demo/cds-demo.component';

export const CDS_OPTION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'demo'
  },
  {
    path: 'demo',
    component: CDSDemoComponent
  },
  {
    path: 'stepper',
    component: CDSStepperComponent
  },
  {
    path: 'cds-option',
    component: CDSOptionsComponent
  },
  {
    path: 'allocation',
    component: AllocationFormComponent
  },
];
