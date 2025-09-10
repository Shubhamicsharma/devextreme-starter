import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular';
import { CDSStepperComponent } from '../cds-stepper/cds-stepper.component';

@Component({
  selector: 'app-cds-demo',
  standalone: true,
  imports: [
    CommonModule,
    DxButtonModule,
    CDSStepperComponent
  ],
  template: `
      <app-cds-stepper></app-cds-stepper>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class CDSDemoComponent {
}
