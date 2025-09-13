import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule, DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { AllocationFormComponent } from '../allocation-form/allocation-form.component';
import { CDSOptionsComponent } from '../cdsOptions/cds-options.component';
import notify from 'devextreme/ui/notify';
import { RVHttpService } from '../../../core/services/http.service';
import { Subscription } from 'rxjs';

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
export class CDSStepperComponent implements OnInit, OnDestroy {
  @ViewChild('cdsOptionsRef') cdsOptionsForm!: CDSOptionsComponent;
  @ViewChild('allocationRef') allocationForm!: AllocationFormComponent;
  @Output() modalClosed = new EventEmitter<void>();

  showModal = false;
  selectedIndex = 0;
  isConfirmed = false;
  isSubmitting = false;
  private subscription = new Subscription();

  steps: StepData[] = [
    { label: 'CDS Options', isValid: false },
    { label: 'Allocation', isValid: false }
  ];

  constructor(private httpService: RVHttpService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openModal(): void {
    this.showModal = true;
    this.selectedIndex = 0;
    
    // Reset accordion state when opening modal to ensure all sections are open
    setTimeout(() => {
      if (this.cdsOptionsForm) {
        this.cdsOptionsForm.resetAccordionState();
      }
    }, 100);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedIndex = 0;
    
    // Reset the accordion state in CDS Options component
    if (this.cdsOptionsForm) {
      this.cdsOptionsForm.resetAccordionState();
    }
    
    this.modalClosed.emit();
  }

  goToNext(): void {
    if (this.selectedIndex < this.steps.length - 1) {
      this.steps[this.selectedIndex].isValid = true;

      // If navigating from CDS Options (step 0) to Allocation (step 1),
      // pass the account and notional values into the Allocation component.
      if (this.selectedIndex === 0 && this.cdsOptionsForm && this.allocationForm) {
        const form = this.cdsOptionsForm.tradeForm;
  const account = form.get('account')?.value ?? null;
  const notional = form.get('notional')?.value ?? null;
  const upfront = form.get('upfront')?.value ?? null;
  const rows = [{ account, notional, upfront }];

        // Prefer calling a typed setter if present to avoid bracket-access and `any`.
        const allocAny = this.allocationForm as any;
        // Pass accounts list from CDS options so allocation can resolve FundId -> account name
        try {
          const accounts = this.cdsOptionsForm.getAccountsList();
          if (typeof allocAny.setAccountsList === 'function') {
            allocAny.setAccountsList(accounts);
          } else {
            allocAny.accountsList = accounts;
          }
        } catch (e) {
          // ignore
        }
        // Pass tradeDate as valuation date for allocation API
        try {
          const tradeDateVal = form.get('tradeDate')?.value ?? null;
          if (tradeDateVal) {
            if (typeof allocAny.setValuationDate === 'function') {
              allocAny.setValuationDate(tradeDateVal);
            } else {
              allocAny.valuationDate = (tradeDateVal instanceof Date) ? allocAny.formatDateForApi(tradeDateVal) : allocAny.formatDateForApi(new Date(tradeDateVal));
            }
          }
        } catch (e) {
          // ignore
        }
        if (typeof allocAny.setInitialAllocationRows === 'function') {
          allocAny.setInitialAllocationRows(rows);
        } else {
          // Fallback to bracket-access for older versions
          allocAny['initialAllocationData'] = rows;
        }
      }

      this.selectedIndex++;
    }
  }

  goToPrevious(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  onNextButtonClick(): void {
    if (this.selectedIndex === 0) {
      // CDS Options step - log form state and validate before proceeding
      const form = this.cdsOptionsForm?.tradeForm;
      console.log('CDS Options - form values:', form?.value);
      console.log('CDS Options - form valid:', form?.valid);

      const requiredFields = [
        'account', 'isin', 'tradeName', 'tradeAction', 'counterParty',
        'securityId', 'capAllocation', 'tradeDate', 'settlementDate',
        'maturityDate', 'optionExpiry', 'notional'
      ];
      const missing = requiredFields.filter(name => !form?.get(name)?.value);
      console.log('CDS Options - missing required fields:', missing);

      // CDS Options step - validate before proceeding
      if (this.cdsOptionsForm && !form?.valid) {
        // Mark all fields as touched to show validation errors
        form?.markAllAsTouched();
        notify({
          message: 'Please fill in all required fields before proceeding.',
          type: 'error',
          displayTime: 3000,
          position: { my: 'center top', at: 'center top' }
        });
        return;
      }
    }
    
    if (this.selectedIndex === this.steps.length - 1) {
      // Final step - ensure allocation form is valid before finishing
      const allocValid = this.allocationForm ? this.allocationForm.isFormValid() : false;
      if (!allocValid) {
        notify({
          message: 'Please complete allocation until percentages sum to ~100% and each row has an account before finishing.',
          type: 'error',
          displayTime: 3000,
          position: { my: 'center top', at: 'center top' }
        });
        return;
      }
      this.onFinish();
    } else {
      this.goToNext();
    }
  }

  // Check if Next button should be disabled
  isNextButtonDisabled(): boolean {
    if (this.selectedIndex === 0) {

      return this.cdsOptionsForm ? !this.cdsOptionsForm.tradeForm.valid : true;
    }
    // For allocation step, disable Next/Finish if allocation form invalid or currently submitting
    if (this.selectedIndex === this.steps.length - 1) {
      const allocValid = this.allocationForm ? this.allocationForm.isFormValid() : false;
      return !allocValid || this.isSubmitting;
    }
    return false;
  }

  getNextButtonText(): string {
    if (this.isConfirmed) return 'Close';
    if (this.selectedIndex === this.steps.length - 1) return 'Finish';
    return 'Next';
  }

  onFinish(): void {
    if (this.isSubmitting) {
      return;
    }

    const cdsData = this.cdsOptionsForm?.getFormData();
    const allocationData = this.allocationForm?.getFormData();

    // Combine the data from both forms into the format expected by the API
    const payload = allocationData.map((alloc: any) => ({
      ...cdsData,
      ...alloc,
    }));

    this.isSubmitting = true;

    this.subscription.add(
      this.httpService.insertCdsOptionData(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          // Use `!response.error` for success check based on ApiResponse model
          if (!response.error) {
            notify({
              message: response.message || 'CDS Option trade inserted successfully!',
              type: 'success',
              position: { my: 'center top', at: 'center top' }
            });
            this.isConfirmed = true;
            this.closeModal();
          } else {
            notify({
              // Use `response.message` for the error message
              message: `Error: ${response.message || 'Failed to insert trade.'}`,
              type: 'error',
              position: { my: 'center top', at: 'center top' }
            });
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error inserting CDS Option data:', error);
          notify({
            message: 'An unexpected error occurred. Please contact support.',
            type: 'error',
            position: { my: 'center top', at: 'center top' }
          });
        }
      })
    );
  }
}
