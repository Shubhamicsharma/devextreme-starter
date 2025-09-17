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
    DxNumberBoxModule,
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
        DxNumberBoxModule,
    ],
})
export class AllocationFormComponent implements OnInit, OnDestroy, OnChanges {
    @Output() navigateToPrevious = new EventEmitter<void>();
    @Output() finishProcess = new EventEmitter<void>();
    @Input() initialAllocationData: any[] | null = null;

    // New properties for totals
    totalNotionalFromCDS = 0;
    totalUpfrontFromCDS = 0;
    totalAllocatedNotional = 0;
    totalAllocatedPercent = 0;
    totalAllocatedUpfront = 0;

    private subscription = new Subscription();

    templates: AllocationTemplate[] = [];
    selectedTemplate: number | null = null;
    isLoadingTemplates = false;
    // Fund combinations from API
    fundCombinations: any[] = [];
    selectedFundCombinationTitle: string | null = null;
    // valuation date string formatted for API (e.g., 11Sep2025)
    valuationDate: string | null = null;

    allocationData: any[] = [
        // fallback placeholder row (will be replaced if initialAllocationData is provided)
        {
            account: 'UCITS',
            notional: 34538.58,
            notionalPercent: 100,
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
                    upfront: r.upfront ?? 0,
                }));

                // Set totals from incoming data
                this.totalNotionalFromCDS =
                    this.initialAllocationData[0]?.notional ?? 0;
                this.totalUpfrontFromCDS =
                    this.initialAllocationData[0]?.upfront ?? 0;
                this.recalculateTotals();
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

            // Set totals from incoming data
            this.totalNotionalFromCDS = incoming?.notional ?? 0;
            this.totalUpfrontFromCDS = incoming?.upfront ?? 0;

            this.computeAllocationState();
            this.recalculateTotals();
        }
    }

    // Allow parent to provide accounts list so we can resolve FundId -> account Name
    accountsList: any[] = [];
    setAccountsList(accounts: any[] | null): void {
        this.accountsList = accounts ?? [];
        console.log('Setting accounts list:', this.accountsList);
    }

    // Extracted mapping logic so it can be reused from ngOnChanges and setter
    private applyInitialAllocationData(rows: any[]): void {
        this.allocationData = rows.map((r) => ({
            account: r.account ?? r.Account ?? 'UNKNOWN',
            notional: r.notional ?? r.Notional ?? 0,
            notionalPercent: r.notionalPercent ?? 100,
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
        this.recalculateTotals();
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
                    this.recalculateTotals();
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
                upfront: 0,
            };
            this.allocationData = [...this.allocationData, row];
            // refresh grid if available
            try {
                this.allocGrid.instance.refresh();
            } catch (e) {}
            this.computeAllocationState();
            this.recalculateTotals();
        } catch (e) {
            console.error('addNewRow error', e);
        }
    }

    // Insert a new row after the provided row reference
    public insertRowAfter(rowData: any): void {
        try {
            const idx = this.allocationData.indexOf(rowData);
            const newRow = {
                account: '',
                notional: 0,
                notionalPercent: 0,
                upfront: 0,
            };
            if (idx >= 0) {
                this.allocationData = [
                    ...this.allocationData.slice(0, idx + 1),
                    newRow,
                    ...this.allocationData.slice(idx + 1),
                ];
            } else {
                this.allocationData = [...this.allocationData, newRow];
            }
            try {
                this.allocGrid.instance.refresh();
                // attempt to start editing the first cell of the newly inserted row
                const newIndex = this.allocationData.indexOf(newRow);
                if (newIndex >= 0) {
                    try {
                        this.allocGrid.instance.editCell(newIndex, 'account');
                    } catch (e) {}
                }
            } catch (e) {}
            this.computeAllocationState();
            this.recalculateTotals();
        } catch (e) {
            console.error('insertRowAfter error', e);
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
            this.recalculateTotals();
        } catch (e) {
            console.error('deleteSelectedRows error', e);
        }
    }

    // Clear all rows
    public clearRows(): void {
        this.allocationData = [];
        this.computeAllocationState();
        this.recalculateTotals();
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
            this.recalculateTotals();
            const totalPercent = this.totalAllocatedPercent;
            const sumReceiveNotional = this.totalAllocatedNotional;

            // if expected total provided, compare receive notional sum to expected
            let notionalOk = true;
            if (this.totalNotionalFromCDS && this.totalNotionalFromCDS > 0) {
                // allow tiny rounding diff
                notionalOk =
                    Math.abs(sumReceiveNotional - this.totalNotionalFromCDS) <=
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
                totalPercent >= 99.9 &&
                totalPercent <= 100.1 &&
                notionalOk &&
                allHaveAccountAndPct &&
                this.allocationData.length > 0;
        } catch (e) {
            console.error('computeAllocationState error', e);
            this.allocationComplete = false;
        }
    }

    // Handle row update events from the grid
    public onSaving(e: any): void {
        if (e.changes.length) {
            const change = e.changes[0];
            // The key is the data row. The changes are in `change.data`.
            const rowData = change.key;

            // Merge the pending changes into the row data to work with the latest values.
            Object.assign(rowData, change.data);

            if (change.data.hasOwnProperty('notional')) {
                // If notional was changed, recalculate percent and upfront.
                const newNotional = rowData.notional;
                if (this.totalNotionalFromCDS > 0) {
                    rowData.notionalPercent =
                        (newNotional / this.totalNotionalFromCDS) * 100;
                } else {
                    rowData.notionalPercent = 0;
                }
                rowData.upfront =
                    (rowData.notionalPercent / 100) * this.totalUpfrontFromCDS;
            } else if (change.data.hasOwnProperty('notionalPercent')) {
                // If percent was changed, recalculate notional and upfront.
                const newPercent = rowData.notionalPercent;
                rowData.notional =
                    (newPercent / 100) * this.totalNotionalFromCDS;
                rowData.upfront = (newPercent / 100) * this.totalUpfrontFromCDS;
            }
            // If 'upfront' is changed, we do nothing to other fields, per requirements.
        }
        // Recalculate totals and check if the allocation is complete after any change.
        this.computeAllocationState();
    }

    public onRowInserted(e: any): void {
        this.computeAllocationState();
        this.recalculateTotals();
    }

    public onRowRemoved(e: any): void {
        this.computeAllocationState();
        this.recalculateTotals();
    }

    recalculateTotals() {
        this.totalAllocatedNotional = this.allocationData.reduce(
            (sum, row) => sum + (Number(row.notional) || 0),
            0
        );
        this.totalAllocatedPercent = this.allocationData.reduce(
            (sum, row) => sum + (Number(row.notionalPercent) || 0),
            0
        );
        this.totalAllocatedUpfront = this.allocationData.reduce(
            (sum, row) => sum + (Number(row.upfront) || 0),
            0
        );
    }

    // Delete a single row by reference
    public deleteSingleRow(rowData: { data: any }): void {
        try {
            console.log('Deleting row', rowData.data);
            // remove by strict reference, or try matching by account/notional/upfront if object shapes differ
            const idx = this.allocationData.findIndex(
                (r: any) =>
                    r === rowData.data ||
                    (r.account === rowData.data.account &&
                        Number(r.notional) === Number(rowData.data.notional) &&
                        Number(r.upfront) === Number(rowData.data.upfront))
            );
            if (idx >= 0) {
                this.allocationData.splice(idx, 1);
            } else {
                // fallback: remove any exact object
                this.allocationData = this.allocationData.filter(
                    (r: any) => r !== rowData.data
                );
            }
            try {
                console.log('Refreshing grid after deletion');
                this.allocGrid.instance.refresh();
            } catch (e) {
                console.error('Error refreshing grid after row deletion', e);
            }
            this.computeAllocationState();
            this.recalculateTotals();
        } catch (e) {
            console.error('deleteSingleRow error', e);
        }
    }
}
