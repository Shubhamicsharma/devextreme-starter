// allocation-swaption.component.ts
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DxButtonModule, DxPopupModule, DxScrollViewModule, DxTextBoxModule, DxSelectBoxModule, DxDataGridModule, DxDateBoxModule } from 'devextreme-angular';
import { RVHttpService } from '../../../core/services/http.service';
import { AllocationTemplate } from '../../../core/models/allocation-template.model';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'allocation-form',
  templateUrl: './allocation-form.component.html',
  standalone: true,
  styleUrls: ['./allocation-form.component.scss'],
  imports: [
    // Add necessary imports here
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DxButtonModule,
    DxPopupModule,
    DxScrollViewModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxDateBoxModule
  ]
})
export class AllocationFormComponent implements OnInit, OnDestroy {
  @Output() navigateToPrevious = new EventEmitter<void>();
  @Output() finishProcess = new EventEmitter<void>();
  
  private subscription = new Subscription();
  
  templates: AllocationTemplate[] = [];
  selectedTemplate: number | null = null;
  isLoadingTemplates = false;

  allocationData = [
    { account: 'UCITS', notional: 34538.58, notionalPercent: 10099, receiveNotional: 34538.58, payNotional: 34538.58, upfront: -8289.2592 },
    { account: 'SICAV', notional: 28750.42, notionalPercent: 8420, receiveNotional: 28750.42, payNotional: 28750.42, upfront: -6912.1008 },
    { account: 'FUND', notional: 42156.89, notionalPercent: 12350, receiveNotional: 42156.89, payNotional: 42156.89, upfront: -10117.6536 },
    { account: 'HEDGE', notional: 19842.33, notionalPercent: 5820, receiveNotional: 19842.33, payNotional: 19842.33, upfront: -4762.1592 },
    { account: 'EQUITY', notional: 31294.76, notionalPercent: 9180, receiveNotional: 31294.76, payNotional: 31294.76, upfront: -7510.7424 }
  ];

  constructor(private httpService: RVHttpService) {}

  ngOnInit(): void {
    this.loadTemplatesFromAPI();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Load templates from API
  loadTemplatesFromAPI(): void {
    this.isLoadingTemplates = true;
    
    this.subscription.add(
      this.httpService.getAllocationTemplates().subscribe({
        next: (response: any) => {
          console.log('Templates API Response:', response);
          if (response?.Success && response?.Model?.Trade_AllocationTemplate) {
            // Filter active templates in the component
            this.templates = response.Model.Trade_AllocationTemplate
              .filter((template: AllocationTemplate) => !template.IsDeleted);
            
            console.log('Active templates loaded:', this.templates);
            
            if (this.templates.length > 0) {
              this.selectedTemplate = this.templates[0].Id; // Select first template by default
            }
          } else {
            console.error('API returned unsuccessful response or missing data');
            this.templates = [];
          }
          this.isLoadingTemplates = false;
        },
        error: (error: any) => {
          console.error('Error loading templates:', error);
          this.isLoadingTemplates = false;
          this.templates = [];
          
          notify({
            message: 'Error loading allocation templates',
            type: 'error',
            position: {
              my: 'center top',
              at: 'center top',
            },
          });
        }
      })
    );
  }

  // Method to check if allocation data is valid for the stepper
  isFormValid(): boolean {
    return this.allocationData && this.allocationData.length > 0;
  }

  // Method to get allocation data for the stepper
  getFormData(): any {
    return this.allocationData;
  }

  // Load selected template
  loadTemplate(): void {
    if (!this.selectedTemplate) return;
    
    // Find the selected template
    const template = this.templates.find(t => t.Id === this.selectedTemplate);
    
    if (template) {
      // Here you would typically load template data from a service
      // For now, we'll simulate loading template data
      console.log('Loading template:', template.TemplateName);
      
      // Example: Update allocation data based on template
      this.updateAllocationDataFromTemplate(this.selectedTemplate);
    }
  }

  // Update allocation data based on selected template
  private updateAllocationDataFromTemplate(templateId: number): void {
    // You can implement specific logic based on template ID
    // For now, we'll use some default data
    console.log('Updating allocation data for template ID:', templateId);
    
    // You could make another API call here to get template-specific allocation data
    // For demonstration, we'll keep the current data structure
    this.allocationData = [
      { account: 'TEMPLATE_' + templateId, notional: 50000.00, notionalPercent: 15000, receiveNotional: 50000.00, payNotional: 50000.00, upfront: -12000.00 },
      { account: 'AUTO_' + templateId, notional: 30000.00, notionalPercent: 9000, receiveNotional: 30000.00, payNotional: 30000.00, upfront: -7200.00 }
    ];
  }

  // Navigate back to previous step
  goToPrevious(): void {
    this.navigateToPrevious.emit();
  }

  // Complete the process
  onFinish(): void {
    this.finishProcess.emit();
  }
}
