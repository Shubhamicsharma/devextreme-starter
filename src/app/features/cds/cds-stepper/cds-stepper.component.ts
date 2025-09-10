import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { AllocationFormComponent } from '../allocation-form/allocation-form.component';
import { CDSOptionsComponent } from '../cdsOptions/cds-options.component';
import notify from 'devextreme/ui/notify';

interface StepData {
  label: string;
  isValid?: boolean;
}

@Component({
  selector: 'app-cds-stepper',
  standalone: true,
  imports: [
    CommonModule,
    DxButtonModule,
    DxPopupModule,
    DxScrollViewModule,
    AllocationFormComponent,
    CDSOptionsComponent
  ],
  templateUrl: './cds-stepper.component.html'
})
export class CDSStepperComponent implements OnInit {
  @ViewChild('cdsOptionsRef') cdsOptionsForm!: CDSOptionsComponent;
  @ViewChild('allocationRef') allocationForm!: AllocationFormComponent;
  @Output() modalClosed = new EventEmitter<void>();

  showModal = false;
  selectedIndex = 0;
  isConfirmed = false;

  steps: StepData[] = [
    { label: 'CDS Options', isValid: false },
    { label: 'Allocation', isValid: false }
  ];

  ngOnInit(): void {}

  openModal(): void {
    this.showModal = true;
    this.selectedIndex = 0;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedIndex = 0;
    this.modalClosed.emit();
  }

  goToNext(): void {
    if (this.selectedIndex < this.steps.length - 1) {
      this.steps[this.selectedIndex].isValid = true;
      this.selectedIndex++;
    }
  }

  goToPrevious(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  onNextButtonClick(): void {
    if (this.selectedIndex === this.steps.length - 1) {
      this.onFinish();
    } else {
      this.goToNext();
    }
  }

  getNextButtonText(): string {
    if (this.isConfirmed) return 'Close';
    if (this.selectedIndex === this.steps.length - 1) return 'Finish';
    return 'Next';
  }

  onFinish(): void {
    const cdsData = this.cdsOptionsForm?.getFormData();
    const allocationData = this.allocationForm?.getFormData();

    console.log('CDS Data:', cdsData);
    console.log('Allocation Data:', allocationData);

    notify({
      message: 'CDS Options and Allocation completed successfully!',
      type: 'success',
      position: { my: 'center top', at: 'center top' }
    });

    this.isConfirmed = true;
    this.closeModal();
  }
}
