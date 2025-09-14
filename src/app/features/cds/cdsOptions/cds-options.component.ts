import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RVHttpService } from '../../../core/services/http.service';
import { CommonCacheDictionaryEnum, CommonCacheEnum } from '../../../shared/core/cache/cache.enum';
import DataSource from 'devextreme/data/data_source';
import {
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxButtonModule,
    DxPopupModule,
    DxScrollViewModule,
    DxLoadIndicatorModule,
    DxRadioGroupModule,
    DxSwitchModule,
    DxAccordionModule,
    DxCheckBoxModule
} from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { CounterParties, Currency, TradeAccounts, TradeNames } from '../../../shared/core/cache/cache.model';
import { CDSOptionModel } from '../../../core/models/cds-option.model';


interface FormFields {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    colSpan?: number;
    options?: { id: number; name: string }[];
    dataSource?: DataSource; // Add dataSource property
    valueExpr?: string; // Add valueExpr property
    displayExpr?: string; // Add displayExpr property
    onText?: string; // For switch
    offText?: string; // For switch
}

@Component({
    selector: 'app-cds-options',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DxTextBoxModule,
        DxTextAreaModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        DxNumberBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxButtonModule,
        DxPopupModule,
        DxScrollViewModule,
        DxLoadIndicatorModule,
        DxRadioGroupModule,
        DxSwitchModule,
        DxAccordionModule,
        DxCheckBoxModule
    ],
    templateUrl: './cds-options.component.html',
    styleUrls: ['./cds-options.component.scss'],
})
export class CDSOptionsComponent implements OnInit {
    @Output() navigateToNext = new EventEmitter<void>();
    
    tradeForm: FormGroup;
    subscription: Subscription = new Subscription();

    // Accordion configuration
    accordionMultiple = true; // Always allow multiple sections open
    accordionCollapsible = true;
    accordionSections: any[] = [];
    selectedAccordionItems: any[] = []; // Will be populated in ngOnInit

    // Data sources for select boxes
    accountsDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    tradeNamesDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    counterPartiesDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    independentCcyDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    dayCountsDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    isinDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    capAllocationDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    tradeActionDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    settlementTypeDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    optionTypeDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    optionStyleDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    frequencyDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    brokerAccountDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });
    brokerPayAccountDataSource: DataSource = new DataSource({
        store: [],
        paginate: false
    });

    // Loading state
    loading = true;
    basicFields: FormFields[] = [
        {
            name: 'account',
            label: 'Account',
            type: 'select',
            placeholder: 'Select Account',
            colSpan: 1,
            dataSource: this.accountsDataSource,
            valueExpr: 'Id',
            displayExpr: 'Name',
            options: undefined,
            // dataSource: this.accountsDataSource
        },
       
        {
            name: 'tradeName',
            label: 'Trade Name',
            type: 'select',
            placeholder: 'Select Trade Name',
            colSpan: 1,
            dataSource: this.tradeNamesDataSource,
            valueExpr: 'Id',
            displayExpr: 'Name',
            options: undefined,
        },
            {
            name: 'capAllocation',
            label: 'Capital Allocation',
            type: 'radio',
            placeholder: 'Select Allocation',
            colSpan: 1,
            valueExpr: 'id',
            displayExpr: 'name',
            options: [
                { id: 1, name: 'Primary' },
                { id: 2, name: 'Secondary' }
            ]
        },
          {
            name: 'isin',
            label: 'Underlying ISIN',
            type: 'select',
            placeholder: 'Select ISIN',
            colSpan: 1,
            valueExpr: 'Id',
            displayExpr: 'ISINCode',
            options: undefined,
        },
        
       
        {
            name: 'tradeDate',
            label: 'Trade Date',
            type: 'date',
            placeholder: 'Select date',
            colSpan: 1,
            options: undefined,
        },
            {
            name: 'tradeAction',
            label: 'Trade Action',
            type: 'radio',
            placeholder: 'Select Action',
            colSpan: 1,
            valueExpr: 'id',
            displayExpr: 'name',
            options: [
                { id: 1, name: 'Enter' },
                { id: 2, name: 'Exit' }
            ]
        },
      
         
        {
            name: 'securityId',
            label: 'Security ID',
            type: 'text',
            placeholder: 'Security ID',
            // Make securityId narrower so it sits on the same row with counterParty
            colSpan: 2,
            options: undefined,
        },
        {
            name: 'counterParty',
            label: 'CounterParty',
            type: 'select',
            placeholder: 'Select Counter Party',
            // Give counterParty more width (2 columns) while keeping same row
            colSpan: 1,
            dataSource: this.counterPartiesDataSource,
            valueExpr: 'Id',
            displayExpr: 'Name',
            options: undefined,
        },
          {
            name: 'description',
            label: 'Description',
            type: 'text',
            placeholder: 'Description',
            colSpan: 3,
            options: undefined,
        },
     
      
      
    ];

    optionFields = [
        {
            name: 'premium',
            label: 'Premium(Trade Price)',
            type: 'number',
            placeholder: 'Enter amount',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'upfront',
            label: 'Upfront(bps)',
            type: 'number',
            placeholder: 'Enter amount',
            colSpan: 1,
            options: undefined,
        },
           {
            name: 'upfrontCcyFxRate',
            label: 'FX Rate',
            type: 'number',
            placeholder: 'Enter FX rate',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'upfrontDate',
            label: 'Upfront Date',
            type: 'date',
            placeholder: 'Select date',
            colSpan: 1,
            options: undefined,
        },
      
        {
            name: 'optionExpiry',
            label: 'Option Expiry Date',
            type: 'date',
            placeholder: 'Select date',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'strikeRate',
            label: 'Strike Rate',
            type: 'number',
            placeholder: 'Enter strike rate',
            colSpan: 1,
            options: undefined,
        },
     
        {
            name: 'settlementType',
            label: 'Settlement Type',
            type: 'select',
            placeholder: 'Select type',
            options: ['Cash', 'Physical'],
            dataSource: this.settlementTypeDataSource,
            valueExpr: 'id',
            displayExpr: 'name',
            colSpan: 1
        },
        {
            name: 'optionType',
            label: 'Option Type',
            type: 'select',
            placeholder: 'Select type',
            options: ['Call', 'Put'],
            dataSource: this.optionTypeDataSource,
            valueExpr: 'id',
            displayExpr: 'name',
            colSpan: 1
        },
        {
            name: 'optionStyle',
            label: 'Option Style',
            type: 'select',
            placeholder: 'Select style',
            options: ['European', 'American', 'Bermudan'],
            // dataSource: this.optionStyleDataSource,
            valueExpr: 'id',
            displayExpr: 'name',
            colSpan: 1
        },

    ];

    cdsFields = [
        {
            name: 'notional',
            label: 'Notional',
            placeholder: 'Enter Notional',
            type: 'number',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'underlyingIsin',
            label: 'Underlying ISIN',
            placeholder: 'Enter ISIN',
            type: 'select',
            dataSource: this.isinDataSource,
            valueExpr: 'Id',
            displayExpr: 'ISINCode',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'redCode',
            label: 'RED Code',
            placeholder: 'Enter RED Code',
            type: 'text',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'fixedRate',
            label: 'Fixed Rate',
            placeholder: 'Enter Rate %',
            type: 'number',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'index',
            label: 'Index',
            placeholder: 'Spread bps',
            type: 'number',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'spread',
            label: 'Spread',
            placeholder: 'Spread bps',
            type: 'number',
            colSpan: 1,
            options: undefined,
        },

        {
            name: 'accuredInterest',
            label: 'Accrued Interest',
            placeholder: 'Enter Interest',
            type: 'number',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'dayCount',
            label: 'Day Count',
            placeholder: 'Select an option',
            type: 'select',
            dataSource: this.dayCountsDataSource,
            valueExpr: 'Id',
            displayExpr: 'Name',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'firstCoupon',
            label: 'First Coupon Date',
            placeholder: 'dd-mm-yyyy',
            type: 'date',
            colSpan: 1,
            options: undefined,
        },
          {
            name: 'maturityDate',
            label: 'Maturity Date',
            type: 'date',
            placeholder: 'Select date',
            colSpan: 1,
            options: undefined,
        },

        {
            name: 'tradeRationale',
            label: 'Trade Rationale',
            placeholder: 'Enter Rationale',
            type: 'text',
            colSpan: 2,
            options: undefined,
        },
        {
            name: 'frequency',
            label: 'Pay Frequency',
            type: 'select',
            placeholder: 'Select an option',
            options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Semi-Annually', 'Yearly'],
            dataSource: this.frequencyDataSource,
            valueExpr: 'id',
            displayExpr: 'name',
            colSpan: 1
        },
    ];

    tradeOpFields = [
          {
            name: 'brokerPayAccount',
            label: 'Broker Pay Account',
            type: 'select',
            placeholder: 'Select Pay Account',
            options: undefined,
            colSpan: 1,
            dataSource: this.brokerPayAccountDataSource,
            valueExpr: 'Id',
            displayExpr: 'Name',
        },
      
        {
            name: 'brokerAccount',
            label: 'Broker Account',
            type: 'select',
            placeholder: 'Select Broker Account',
            options: undefined,
            colSpan: 1,
            dataSource: this.brokerAccountDataSource,
            valueExpr: 'Id',
            displayExpr: 'Name',
        },
          {
            name: 'utiId',
            label: 'UTI ID',
            type: 'text',
            placeholder: 'Enter UTI ID',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'utiPrefix',
            label: 'UTI Prefix',
            type: 'text',
            placeholder: 'Enter Prefix',
            colSpan: 1,
            options: undefined,
        },
      
        {
            name: 'independentAmt',
            label: 'Independent Amt',
            type: 'number',
            placeholder: 'Enter Amount',
            colSpan: 1,
            options: undefined,
        },
        {
            name: 'independentCcy',
            label: 'Independent Ccy',
            type: 'select',
            placeholder: 'Select Currency',
            options: undefined,
            colSpan: 1,
            dataSource: this.independentCcyDataSource,
            valueExpr: 'Id',
            displayExpr: 'Code',
        },
    ];

    constructor(
        private fb: FormBuilder,
        private httpService: RVHttpService
    ) {
        this.tradeForm = this.fb.group({
            account: ['', Validators.required],
            isin: ['', Validators.required],
            tradeName: ['', Validators.required],
            tradeAction: ['', Validators.required],
            counterParty: ['', Validators.required],
            capAllocation: ['', Validators.required],
            securityId: ['CDS Option', Validators.required],
            description: ['CDS Option'],
            // Make securityId and description default values and read-only where appropriate

            tradeDate: ['', Validators.required],
            // settlementDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            optionExpiry: ['', Validators.required],
            premium: [''],
            upfront: [''],
            upfrontDate: [''],
            strikeRate: [''],
            upfrontCcyFxRate: [''],
            settlementType: [''],
            optionStyle: [''],
            optionType: [''],

            notional: ['', Validators.required],
            underlyingIsin: [''],
            redCode: [''],
            fixedRate: [''],
            dayCount: [''],
            frequency: [''],
            index: [''],
            spread: [''],
            accuredInterest: [''],
            firstCoupon: [''],
            tradeRationale: [''],

            utiId: [''],
            utiPrefix: [''],
            independentAmt: [''],
            independentCcy: [''],
            brokerAccount: [''],
            brokerPayAccount: [''],
        });
        // Make securityId and description read-only by disabling the controls
        const secCtrl = this.tradeForm.get('securityId');
        const descCtrl = this.tradeForm.get('description');
        try {
            secCtrl?.disable({ emitEvent: false });
            descCtrl?.disable({ emitEvent: false });
        } catch (e) {
            // ignore
        }
    }


    inputClass(controlName: string) {
        const control = this.tradeForm.get(controlName);
        if (control?.touched && control.invalid) {
            return 'w-full border border-red-500 rounded-lg p-2 focus:ring-2 focus:ring-red-500';
        }
        return 'w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500';
    }

    onSubmit() {
        if (this.tradeForm.valid) {
            // Show loading indicator
            const loadingPromise = new Promise((resolve) => {
                setTimeout(() => {
                    console.log(this.tradeForm.value);
                    resolve(true);
                }, 1000);
            });

            loadingPromise.then(() => {
                notify({
                    message: 'Trade submitted successfully!',
                    position: {
                        my: 'center top',
                        at: 'center top',
                    },
                    type: 'success',
                });
                // Form submitted successfully - parent stepper will handle navigation
            });
        } else {
            this.tradeForm.markAllAsTouched();
            notify({
                message: 'Please fill all required fields',
                position: {
                    my: 'center top',
                    at: 'center top',
                },
                type: 'error',
            });
        }
    }

    onSave() {
        // Implement save logic
        notify({
            message: 'Trade saved and moving to allocation step',
            position: {
                my: 'center top',
                at: 'center top',
            },
            type: 'success',
        });
        
        // Navigate to next step
        this.navigateToNext.emit();
    }

    onPreview() {
        // Implement preview logic
        const previewData = this.tradeForm.value;
        console.log('Preview:', previewData);
    }

    ngOnInit(): void {
        // Initialize accordion sections
        this.accordionSections = [
            {
                title: 'Basic Information',
                sectionType: 'basic',
                fields: this.basicFields
            },
            {
                title: 'Options Details',
                sectionType: 'options',
                fields: this.optionFields
            },
            {
                title: 'CDS Details',
                sectionType: 'cds',
                fields: this.cdsFields
            },
            {
                title: 'Trade Operations',
                sectionType: 'tradeOps',
                fields: this.tradeOpFields
            }
        ];
        
        // Set all sections to be open by default
        this.selectedAccordionItems = [...this.accordionSections];
        
        this.loadCacheData();

        // Make every defined field required (so stepper only advances when all fields filled)
        this.makeAllFieldsRequired();
    }

    // Make all fields defined in the field arrays required on the FormGroup
    private makeAllFieldsRequired(): void {
        // Intentionally exclude trade operation fields so they remain optional
        // and the stepper can advance even if those fields are not filled.
        const allFields = [
            ...(this.basicFields || []),
            ...(this.optionFields || []),
            ...(this.cdsFields || [])
            // tradeOpFields are intentionally omitted here
        ];

        const updated: string[] = [];

        allFields.forEach((f: any) => {
            const control = this.tradeForm.get(f.name);
            if (control) {
                // preserve existing validators where possible
                const existing = control.validator ? [control.validator] : [];
                (control as any).setValidators([...(existing as any), Validators.required]);
                control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
                updated.push(f.name);
            }
        });

        console.log('makeAllFieldsRequired applied to controls:', updated);
    }

    // Reset accordion state - close all sections and reopen them
    resetAccordionState(): void {
        // First clear all selected items
        this.selectedAccordionItems = [];
        
        // Use setTimeout to ensure the accordion processes the empty state first
        setTimeout(() => {
            // Then reopen all sections
            this.selectedAccordionItems = [...this.accordionSections];
        }, 50);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Compute width percentage for fractional colSpan values.
    // The layout grid uses 3 columns on large screens; a colSpan of 1.5
    // will result in 50% width (1.5 / 3 * 100).
    public getFieldWidthPercent(field: any): number | null {
        const totalColumns = 3;
        const raw = Number(field?.colSpan ?? 1);
        if (isNaN(raw)) return null;
        // If colSpan is non-integer (fractional), return the percentage; otherwise null
        if (!Number.isInteger(raw)) {
            return (raw / totalColumns) * 100;
        }
        return null;
    }

    // Return the loaded accounts as an array for parent components
    public getAccountsList(): any[] {
        try {
            // DevExtreme DataSource provides items() when data is loaded
            if (this.accountsDataSource && typeof (this.accountsDataSource as any).items === 'function') {
                return (this.accountsDataSource as any).items() || [];
            }
            // Fallback: if store was provided as an array during initialization
            const store = (this.accountsDataSource as any)?.store;
            return Array.isArray(store) ? store : [];
        } catch (e) {
            console.error('Error retrieving accounts list from accountsDataSource', e);
            return [];
        }
    }

    private _mapAndCreateDataSource<T>(data: any[], mapFn: (item: any) => T): DataSource {
        const mappedData: T[] = data?.map(mapFn) || [];
        return new DataSource({
            store: mappedData,
            paginate: false,
        });
    }

    private loadCacheData(): void {
        const cacheTypes = [
            CommonCacheDictionaryEnum.TradeAccount,
            CommonCacheDictionaryEnum.ActiveTradeName,
            CommonCacheDictionaryEnum.Counterparty,
            CommonCacheDictionaryEnum.Currency,
            CommonCacheDictionaryEnum.DayCount,
            CommonCacheDictionaryEnum.CurrentAllocation,
            CommonCacheDictionaryEnum.ISIN,
            CommonCacheDictionaryEnum.TradarAccount,
            // CommonCacheEnum.AllocationTemplate, // This enum is not used in the current data source mappings
        ];
        console.log(cacheTypes);

        this.subscription.add(

            this.httpService.getCacheLookupsData(cacheTypes).subscribe({
                next: (response: any) => {
                    console.log(response);
                    if (response?.Model) {
                        this.accountsDataSource = new DataSource({
                            store: response.Model.TradeAccounts || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const accountField = this.basicFields.find(field => field.name === 'account');
                        if (accountField) {
                            accountField.dataSource = this.accountsDataSource;
                        }

                        this.tradeNamesDataSource = new DataSource({
                            store: response.Model.ActiveTradeNames || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const tradeNameField = this.basicFields.find(field => field.name === 'tradeName');
                        if (tradeNameField) {
                            tradeNameField.dataSource = this.tradeNamesDataSource;
                        }

                        this.counterPartiesDataSource = new DataSource({
                            store: response.Model.CounterParties || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const counterPartyField = this.basicFields.find(field => field.name === 'counterParty');
                        if (counterPartyField) {
                            counterPartyField.dataSource = this.counterPartiesDataSource;
                        }

                        this.independentCcyDataSource = new DataSource({
                            store: response.Model.Currencies || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const independentCcyField = this.tradeOpFields.find(field => field.name === 'independentCcy');
                        if (independentCcyField) {
                            independentCcyField.dataSource = this.independentCcyDataSource;
                        }

                        this.dayCountsDataSource = new DataSource({
                            store: response.Model.DayCounts || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const dayCountField = this.cdsFields.find(field => field.name === 'dayCount');
                        if (dayCountField) {
                            dayCountField.dataSource = this.dayCountsDataSource;
                        }

                        this.isinDataSource = new DataSource({
                            store: response.Model.Isins || [],
                            paginate: true,
                            pageSize: 10
                        });

                        const isinField = this.basicFields.find(field => field.name === 'isin');
                        if (isinField) {
                            isinField.dataSource = this.isinDataSource;
                        }

                        this.isinDataSource = new DataSource({
                            store: response.Model.Isins || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const underlyingIsinField = this.cdsFields.find(field => field.name === 'underlyingIsin');
                        if (underlyingIsinField) {
                            underlyingIsinField.dataSource = this.isinDataSource;
                        }

                        this.brokerAccountDataSource = new DataSource({
                            store: response.Model.TradarAccounts || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const brokerAccountField = this.tradeOpFields.find(field => field.name === 'brokerAccount');
                        if (brokerAccountField) {
                            brokerAccountField.dataSource = this.brokerAccountDataSource;
                        }

                        this.brokerPayAccountDataSource = new DataSource({
                            store: response.Model.TradarAccounts || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const brokerPayAccountField = this.tradeOpFields.find(field => field.name === 'brokerPayAccount');
                        if (brokerPayAccountField) {
                            brokerPayAccountField.dataSource = this.brokerPayAccountDataSource;
                        }

                        // Cap Allocation is a static lookup, so it can be mapped directly
                        this.capAllocationDataSource = new DataSource({
                            store: response.Model.CurrentAllocations || [],
                            paginate: true,
                            pageSize: 10
                        });
                        const capAllocationField = this.basicFields.find(field => field.name === 'capAllocation');
                        if (capAllocationField) {
                            capAllocationField.dataSource = this.capAllocationDataSource;
                        }
                        this.basicFields = [...this.basicFields];
                    }
                    // Populate static data sources after dynamic data is loaded
                    this.populateStaticDataSources();

                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading cache data:', error);
                    this.loading = false;
                    notify({
                        message: 'Error loading form data',
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

    private populateStaticDataSources(): void {
        const settlementTypeField = this.optionFields.find(field => field.name === 'settlementType');
        if (settlementTypeField?.options) {
            this.settlementTypeDataSource = this._mapAndCreateDataSource(settlementTypeField.options, (item: string) => ({
                id: item,
                name: item,
            }));
            settlementTypeField.dataSource = this.settlementTypeDataSource;
        }

        const optionTypeField = this.optionFields.find(field => field.name === 'optionType');
        if (optionTypeField?.options) {
            this.optionTypeDataSource = this._mapAndCreateDataSource(optionTypeField.options, (item: string) => ({
                id: item,
                name: item,
            }));
            optionTypeField.dataSource = this.optionTypeDataSource;
        }

        const optionStyleField = this.optionFields.find(field => field.name === 'optionStyle');
        if (optionStyleField?.options) {
            this.optionStyleDataSource = this._mapAndCreateDataSource(optionStyleField.options, (item: string) => ({
                id: item,
                name: item,
            }));
            optionStyleField.dataSource = this.optionStyleDataSource;
        }

        const tradeActionField = this.basicFields.find(field => field.name === 'tradeAction');
        if (tradeActionField?.options) {
            this.tradeActionDataSource = this._mapAndCreateDataSource(tradeActionField.options, (item: string) => ({
                id: item,
                name: item,
            }));
            tradeActionField.dataSource = this.tradeActionDataSource;
        }

        const frequencyField = this.cdsFields.find(field => field.name === 'frequency');
        if (frequencyField?.options) {
            this.frequencyDataSource = this._mapAndCreateDataSource(frequencyField.options, (item: string) => ({
                id: item,
                name: item,
            }));
            frequencyField.dataSource = this.frequencyDataSource;
        }

        // const brokerAccountField = this.tradeOpFields.find(field => field.name === 'brokerAccount');
        // if (brokerAccountField?.options) {
        //     this.brokerAccountDataSource = this._mapAndCreateDataSource(brokerAccountField.options, (item: string) => ({
        //         id: item,
        //         name: item,
        //     }));
        //     brokerAccountField.dataSource = this.brokerAccountDataSource;
        // }

        // const brokerPayAccountField = this.tradeOpFields.find(field => field.name === 'brokerPayAccount');
        // if (brokerPayAccountField?.options) {
        //     this.brokerPayAccountDataSource = this._mapAndCreateDataSource(brokerPayAccountField.options, (item: string) => ({
        //         id: item,
        //         name: item,
        //     }));
        //     brokerPayAccountField.dataSource = this.brokerPayAccountDataSource;
        // }
    }

    // Method to check if the form is valid for the stepper
    isFormValid(): boolean {
        return this.tradeForm.valid;
    }

    // Method to get form data for the stepper
    getFormData(): Partial<CDSOptionModel> {
        return this.tradeForm.value as Partial<CDSOptionModel>;
    }

}
