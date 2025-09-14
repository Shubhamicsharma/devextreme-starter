// allocation-swaption.component.ts
import { CommonModule } from '@angular/common';
import {
    Component,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
    DxButtonModule,
    DxPopupModule,
    DxScrollViewModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDataGridComponent,
} from 'devextreme-angular';
import { RVHttpService } from '../../../core/services/http.service';
import { AllocationTemplate } from '../../../core/models/allocation-template.model';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { CDSOptionModel } from '../../../core/models/cds-option.model';

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
        DxDateBoxModule,
    ],
})
export class AllocationFormComponent implements OnInit, OnDestroy {
    @Output() navigateToPrevious = new EventEmitter<void>();
    @Output() finishProcess = new EventEmitter<void>();
    @Input() initialAllocationData: any[] | null = null;

    private subscription = new Subscription();

    templates: AllocationTemplate[] = [];
    selectedTemplate: number | null = null;
    isLoadingTemplates = false;
    // Fund combinations from API
    fundCombinations: any[] = [];
    selectedFundCombinationTitle: string | null = null;
    // valuation date string formatted for API (e.g., 11Sep2025)
    valuationDate: string | null = null;

    allocationData = [
        // fallback placeholder row (will be replaced if initialAllocationData is provided)
        {
            account: 'UCITS',
            notional: 34538.58,
            notionalPercent: 10099,
            receiveNotional: 34538.58,
            payNotional: 34538.58,
            upfront: -8289.2592,
        },
    ];

    @ViewChild('allocGrid', { static: false }) allocGrid!: DxDataGridComponent;

    // internal totals and completion flag
    expectedTotalNotional = 0; // expected total (from parent initialAllocationData)
    allocationComplete = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['initialAllocationData'] && this.initialAllocationData) {
            // Replace allocationData with incoming rows, or map account/notional if single object
            if (
                Array.isArray(this.initialAllocationData) &&
                this.initialAllocationData.length
            ) {
                this.allocationData = this.initialAllocationData.map((r) => ({
                    account: r.account ?? r.Account ?? 'UNKNOWN',
                    notional: r.notional ?? r.Notional ?? 0,
                    notionalPercent: r.notionalPercent ?? 100,
                    receiveNotional: r.notional ?? r.Notional ?? 0,
                    payNotional: r.notional ?? r.Notional ?? 0,
                    upfront: r.upfront ?? 0,
                }));
            }
        }
    }

    setInitialAllocationRows(rows: any[] | null): void {
        this.initialAllocationData = rows;
        if (rows && Array.isArray(rows) && rows.length) {
            this.applyInitialAllocationData(rows);
            // set expected total based on incoming row
            const incoming = rows[0];
            this.expectedTotalNotional = Number(
                incoming?.notional ?? incoming?.Notional ?? 0
            );
            this.computeAllocationState();
        }
    }

    // Allow parent to provide accounts list so we can resolve FundId -> account Name
    accountsList: any[] = [];
    setAccountsList(accounts: any[] | null): void {
        this.accountsList = accounts ?? [];
    }

    // Extracted mapping logic so it can be reused from ngOnChanges and setter
    private applyInitialAllocationData(rows: any[]): void {
        this.allocationData = rows.map((r) => ({
            account: r.account ?? r.Account ?? 'UNKNOWN',
            notional: r.notional ?? r.Notional ?? 0,
            notionalPercent: r.notionalPercent ?? 100,
            receiveNotional: r.notional ?? r.Notional ?? 0,
            payNotional: r.notional ?? r.Notional ?? 0,
            upfront: r.upfront ?? 0,
        }));
        // compute initial expected total if provided
        if (this.initialAllocationData && this.initialAllocationData.length) {
            this.expectedTotalNotional = Number(
                this.initialAllocationData[0].notional ??
                    this.initialAllocationData[0].Notional ??
                    0
            );
        }
        this.computeAllocationState();
    }

    constructor(private httpService: RVHttpService) {}

    ngOnInit(): void {
        this.loadTemplatesFromAPI();
        // Also load fund combinations (used for template selection and allocations)
        this.loadFundCombinations();
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
                    if (
                        response?.Success &&
                        response?.Model?.Trade_AllocationTemplate
                    ) {
                        // Filter active templates in the component
                        this.templates =
                            response.Model.Trade_AllocationTemplate.filter(
                                (template: AllocationTemplate) =>
                                    !template.IsDeleted
                            );

                        console.log('Active templates loaded:', this.templates);

                        if (this.templates.length > 0) {
                            this.selectedTemplate = this.templates[0].Id; // Select first template by default
                        }
                    } else {
                        console.error(
                            'API returned unsuccessful response or missing data'
                        );
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
                },
            })
        );
    }

    // Load fund combinations (new API) which includes FundCombination and FundAllocation
    loadFundCombinations(valuationDate?: string): void {
        this.isLoadingTemplates = true;
        // Prefer passed valuationDate, then stored this.valuationDate, then default to today
        const valDate =
            valuationDate ??
            this.valuationDate ??
            this.formatDateForApi(new Date());
        this.subscription.add(
            this.httpService.getFundCombination(valDate).subscribe({
                next: (response: any) => {
                    if (response?.Success && response?.Model) {
                        this.fundCombinations =
                            response.Model.FundCombination || [];
                    } else if (response?.FundCombination) {
                        // Some endpoints return the model directly
                        this.fundCombinations = response.FundCombination || [];
                    } else {
                        this.fundCombinations = [];
                    }
                    this.isLoadingTemplates = false;
                },
                error: (err: any) => {
                    console.error('Error loading fund combinations', err);
                    this.fundCombinations = [];
                    this.isLoadingTemplates = false;
                },
            })
        );
    }

    // Set valuation date from parent and reload fund combinations for that date
    setValuationDate(date: Date | string | null): void {
        if (!date) {
            this.valuationDate = null;
            return;
        }
        const formatted =
            date instanceof Date
                ? this.formatDateForApi(date)
                : this.formatDateForApi(new Date(date));
        this.valuationDate = formatted;
        // Reload fund combinations for the provided valuation date
        this.loadFundCombinations(formatted);
    }

    private formatDateForApi(d: Date): string {
        // Format as ddMMMyyyy (e.g., 11Sep2025)
        const day = ('0' + d.getDate()).slice(-2);
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const mon = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day}${mon}${year}`;
    }

    // Method to check if allocation data is valid for the stepper
    isFormValid(): boolean {
        return (
            this.allocationData &&
            this.allocationData.length > 0 &&
            this.allocationComplete
        );
    }

    // Method to get allocation data for the stepper
    getFormData(): Partial<CDSOptionModel>[] {
        return this.allocationData as Partial<CDSOptionModel>[];
    }

    // Load selected template: use selectedFundCombinationTitle to find matching FundAllocation entries
    loadTemplate(): void {
        if (!this.selectedFundCombinationTitle) return;

        // Fetch allocations that match the selected template name
        const title = this.selectedFundCombinationTitle;

        // Call the fund combination API again to get allocations (or reuse cached info if present)
        const valDate = new Date().toISOString().slice(0, 10);
        this.isLoadingTemplates = true;
        this.subscription.add(
            this.httpService.getFundCombination(valDate).subscribe({
                next: (response: any) => {
                    this.isLoadingTemplates = false;
                    const allocations =
                        response?.Model?.FundAllocation ??
                        response?.FundAllocation ??
                        [];

                    // Filter allocations where Title matches the template's Title
                    const matched = allocations.filter(
                        (a: any) => a.Title === title
                    );

                    if (matched.length === 0) {
                        console.warn(
                            'No allocations found for template:',
                            title
                        );
                        this.allocationData = [];
                        return;
                    }

                    // Compute notional splits: use total notional from current incoming initialAllocationData if provided
                    // If no incoming notional, fallback to 0
                    const incomingNotional =
                        this.initialAllocationData &&
                        this.initialAllocationData.length
                            ? this.initialAllocationData[0].notional ??
                              this.initialAllocationData[0].Notional ??
                              0
                            : 0;

                    // Build allocation rows by mapping percentage to notional amount and upfront
                    const incomingUpfront =
                        this.initialAllocationData &&
                        this.initialAllocationData.length
                            ? this.initialAllocationData[0].upfront ??
                              this.initialAllocationData[0].Upfront ??
                              0
                            : 0;

                    // First compute raw splits (rounded) then correct rounding differences
                    const rows = matched.map((m: any) => {
                        const pct = Number(m.Allocation) || 0;
                        const notionalVal = +(incomingNotional * (pct / 100));
                        const upfrontVal = +(incomingUpfront * (pct / 100));
                        return {
                            account: m.FundId ?? m.Title,
                            notionalPercent: pct,
                            notional: +notionalVal.toFixed(2),
                            receiveNotional: +notionalVal.toFixed(2),
                            payNotional: +notionalVal.toFixed(2),
                            upfront: +upfrontVal.toFixed(4),
                        };
                    });

                    // Rounding correction so sums equal incoming totals
                    const sumNotional = rows.reduce(
                        (s: number, r: any) => s + (r.notional ?? 0),
                        0
                    );
                    const notionalDiff = +(
                        incomingNotional - sumNotional
                    ).toFixed(2);
                    if (Math.abs(notionalDiff) >= 0.01 && rows.length > 0) {
                        // adjust last row's notional to absorb rounding diff
                        rows[rows.length - 1].notional = +(
                            rows[rows.length - 1].notional + notionalDiff
                        ).toFixed(2);
                        // also adjust receive/pay accordingly
                        rows[rows.length - 1].receiveNotional =
                            rows[rows.length - 1].notional;
                        rows[rows.length - 1].payNotional =
                            rows[rows.length - 1].notional;
                    }

                    const sumUpfront = rows.reduce(
                        (s: number, r: any) => s + (r.upfront ?? 0),
                        0
                    );
                    const upfrontDiff = +(incomingUpfront - sumUpfront).toFixed(
                        4
                    );
                    if (Math.abs(upfrontDiff) >= 0.0001 && rows.length > 0) {
                        rows[rows.length - 1].upfront = +(
                            rows[rows.length - 1].upfront + upfrontDiff
                        ).toFixed(4);
                    }

                    this.allocationData = rows;
                },
                error: (err: any) => {
                    this.isLoadingTemplates = false;
                    console.error(
                        'Error loading allocations for template',
                        err
                    );
                },
            })
        );
    }

    // Update allocation data based on selected template
    private updateAllocationDataFromTemplate(templateId: number): void {
        // You can implement specific logic based on template ID
        // For now, we'll use some default data
        console.log('Updating allocation data for template ID:', templateId);

        // You could make another API call here to get template-specific allocation data
        // For demonstration, we'll keep the current data structure
        this.allocationData = [
            {
                account: 'TEMPLATE_' + templateId,
                notional: 50000.0,
                notionalPercent: 15000,
                receiveNotional: 50000.0,
                payNotional: 50000.0,
                upfront: -12000.0,
            },
            {
                account: 'AUTO_' + templateId,
                notional: 30000.0,
                notionalPercent: 9000,
                receiveNotional: 30000.0,
                payNotional: 30000.0,
                upfront: -7200.0,
            },
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

    // ====== New methods implementing backend logic ======
    // Add a new empty allocation row
    public addNewRow(): void {
        try {
            const row = {
                account: '',
                notional: 0,
                notionalPercent: 0,
                receiveNotional: 0,
                payNotional: 0,
                upfront: 0,
            };
            this.allocationData = [...this.allocationData, row];
            // refresh grid if available
            try {
                this.allocGrid.instance.refresh();
            } catch (e) {}
            this.computeAllocationState();
        } catch (e) {
            console.error('addNewRow error', e);
        }
    }

    // Delete selected rows in the grid
    public deleteSelectedRows(): void {
        try {
            if (!this.allocGrid) return;
            const selected =
                this.allocGrid.instance.getSelectedRowsData() || [];
            if (!selected.length) return;
            const remaining = this.allocationData.filter(
                (r: any) => !selected.includes(r)
            );
            this.allocationData = remaining;
            try {
                this.allocGrid.instance.refresh();
            } catch (e) {}
            this.computeAllocationState();
        } catch (e) {
            console.error('deleteSelectedRows error', e);
        }
    }

    // Clear all rows
    public clearRows(): void {
        this.allocationData = [];
        this.computeAllocationState();
    }

    // Calculate notional based on percent
    public NotionalCal(Notional: number, NotionalPer: number): number {
        let Notion = 0;
        try {
            const notion = Number(Notional) || 0;
            Notion = (notion * Number(NotionalPer || 0)) / 100;
        } catch (e) {
            console.error('NotionalCal error', e);
        }
        return Notion;
    }

    // Compute totals and determine completion similar to backend CheckNotionalPerc
    public computeAllocationState(): void {
        try {
            const totalPercent = this.allocationData.reduce(
                (s: number, r: any) => s + (Number(r.notionalPercent) || 0),
                0
            );
            const sumReceiveNotional = this.allocationData.reduce(
                (s: number, r: any) => s + (Number(r.receiveNotional) || 0),
                0
            );

            // if expected total provided, compare receive notional sum to expected
            let notionalOk = true;
            if (this.expectedTotalNotional && this.expectedTotalNotional > 0) {
                // allow tiny rounding diff
                notionalOk =
                    Math.abs(sumReceiveNotional - this.expectedTotalNotional) <=
                    0.01;
            }

            let allHaveAccountAndPct = true;
            for (const item of this.allocationData) {
                if (!item.account || Number(item.notionalPercent) === 0) {
                    allHaveAccountAndPct = false;
                    break;
                }
            }

            // Backend accepted exact equality of ReceiveNotional to expected; here we require total percent ~100 and notional match
            this.allocationComplete =
                totalPercent >= 99 &&
                totalPercent <= 100 &&
                notionalOk &&
                allHaveAccountAndPct &&
                this.allocationData.length > 0;
        } catch (e) {
            console.error('computeAllocationState error', e);
            this.allocationComplete = false;
        }
    }

    // Handle row update events from the grid
    public onRowUpdated(e: any): void {
        try {
            const data = e.data || {};
            const key = e.key;
            // find index
            const idx = this.allocationData.findIndex(
                (r: any) => r === e.data || r.account === e.key || r === e.key
            );
            // If not found, fallback to attempt matching by key if row object provided
            // Update logic similar to backend: if notional changed, compute percent; if percent changed, compute notional/upfront/payNotional
            if (
                data.hasOwnProperty('receiveNotional') ||
                data.hasOwnProperty('notional')
            ) {
                // notional edited -> update percent and pay/upfront
                const newNotional =
                    Number(data.receiveNotional ?? data.notional) || 0;
                // update corresponding entry by reference or by id
                const target =
                    this.allocationData[idx] ??
                    this.allocationData.find(
                        (r: any) => r.account === (e.key?.account ?? e.key)
                    );
                if (target) {
                    target.receiveNotional = Math.abs(newNotional);
                    target.payNotional = Math.abs(
                        this.NotionalCal(
                            this.expectedTotalNotional || newNotional,
                            target.notionalPercent || 0
                        )
                    );
                    // compute percent if expectedTotalNotional present
                    if (
                        this.expectedTotalNotional &&
                        this.expectedTotalNotional > 0
                    ) {
                        target.notionalPercent = +(
                            (newNotional / this.expectedTotalNotional) *
                            100
                        );
                    }
                }
            }

            if (data.hasOwnProperty('notionalPercent')) {
                const newPct = Number(data.notionalPercent) || 0;
                const target =
                    this.allocationData[idx] ??
                    this.allocationData.find(
                        (r: any) => r.account === (e.key?.account ?? e.key)
                    );
                if (target) {
                    const total =
                        this.expectedTotalNotional ||
                        this.allocationData.reduce(
                            (s: number, r: any) =>
                                s + (Number(r.receiveNotional) || 0),
                            0
                        );
                    const newNotional = +(total * (newPct / 100));
                    target.receiveNotional = Math.abs(newNotional);
                    target.payNotional = Math.abs(
                        this.NotionalCal(total, newPct)
                    );
                    target.upfront = this.NotionalCal(
                        Number(this.initialAllocationData?.[0]?.upfront ?? 0),
                        newPct
                    );
                    target.notionalPercent = newPct;
                }
            }

            // recompute completion state
            this.computeAllocationState();
        } catch (e) {
            console.error('onRowUpdated error', e);
        }
    }

    public onRowInserted(e: any): void {
        this.computeAllocationState();
    }

    public onRowRemoved(e: any): void {
        this.computeAllocationState();
    }

    // Delete a single row by reference
    public deleteSingleRow(row: any): void {
        try {
            this.allocationData = this.allocationData.filter(
                (r: any) => r !== row
            );
            try {
                this.allocGrid.instance.refresh();
            } catch (e) {}
            this.computeAllocationState();
        } catch (e) {
            console.error('deleteSingleRow error', e);
        }
    }
}
