import { Routes } from '@angular/router';
import { CDSOptionsComponent } from './cdsOptions/cds-options.component';


export const CDS_OPTION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'cds-option'
  },
  {
    path: 'cds-option',
    component: CDSOptionsComponent
  },
];
