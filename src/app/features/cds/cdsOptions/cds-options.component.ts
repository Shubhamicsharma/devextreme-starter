import { Component } from '@angular/core';
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
} from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    ],
    templateUrl: './cds-options.component.html',
    styleUrl: './cds-options.component.scss',
})
export class CDSOptionsComponent {
    showModal = false;
    tradeForm: FormGroup;

    basicFields = [
        {
            name: 'account',
            label: 'Account',
            type: 'select',
            placeholder: 'Account',
            options: ['Account 1', 'Account 2', 'Account 3'],
            colSpan: 1,
        },
        {
            name: 'tradeName',
            label: 'Trade Name',
            type: 'select',
            placeholder: 'Trade name',
            options: ['Trade 1', 'Trade 2', 'Trade 3'],
            colSpan: 1,
        },
        {
            name: 'isin',
            label: 'Underlying ISIN',
            type: 'text',
            placeholder: 'Enter ISIN',
            colSpan: 1,
        },
        {
            name: 'tradeDate',
            label: 'Trade Date',
            type: 'date',
            placeholder: 'Select date',
            colSpan: 1,
        },
        {
            name: 'settlementDate',
            label: 'Settlement Date',
            type: 'date',
            placeholder: 'Select date',
            colSpan: 1,
        },
        {
            name: 'maturityDate',
            label: 'Maturity Date',
            type: 'date',
            placeholder: 'Select date',
            colSpan: 1,
        },
        {
            name: 'securityId',
            label: 'Security ID',
            type: 'text',
            placeholder: 'Security ID',
            colSpan: 2,
        },
        {
            name: 'counterParty',
            label: 'Counter Party',
            type: 'select',
            placeholder: 'Select Counter Party',
            options: ['Party A', 'Party B', 'Party C'],
            colSpan: 1,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            placeholder: 'Enter description',
            colSpan: 2,
        },
        {
            name: 'capAllocation',
            label: 'Cap Allocation',
            type: 'select',
            placeholder: 'Select Allocation',
            options: ['Cap 1', 'Cap 2', 'Cap 3'],
            colSpan: 1,
        },
        {
            name: 'tradeAction',
            label: 'Trade Action',
            type: 'select',
            placeholder: 'Select Action',
            options: ['Buy', 'Sell', 'Transfer'],
            colSpan: 3,
        },
    ];

    optionFields = [
        {
            name: 'Premium',
            label: 'Premium',
            type: 'number',
            placeholder: 'Enter amount',
        },
        {
            name: 'Upfront',
            label: 'Upfront',
            type: 'text',
            placeholder: 'Enter amount',
        },
        {
            name: 'Upfront Date',
            label: 'Upfront Date',
            type: 'date',
            placeholder: 'Select date',
        },

        {
            name: 'Strike Rate',
            label: 'Strike Rate',
            type: 'number',
            placeholder: 'Enter strike rate',
        },
        {
            name: 'Upfront/Ccy/FXRate',
            label: 'FX Rate',
            type: 'number',
            placeholder: 'Enter FX rate',
        },
        {
            name: 'Settlement Type',
            label: 'Settlement Type',
            type: 'select',
            placeholder: 'Select type',
            options: ['Physical', 'Cash', 'Both'],
        },
        {
            name: 'Option Type',
            label: 'Option Type',
            type: 'select',
            placeholder: 'Select type',
            options: ['Fixed', 'Float', 'Mixed'],
        },
        {
            name: 'Option Style',
            label: 'Option Style',
            type: 'select',
            placeholder: 'Select style',
            options: ['European', 'American', 'Bermudan'],
        },

        {
            name: 'optionExpiry',
            label: 'Option Expiry Date',
            type: 'date',
            placeholder: 'Select date',
        },
        // { name: 'Trade Price', label: 'Trade Price', type: 'number', placeholder: 'Enter price' },
    ];

    cdsFields = [
        {
            name: 'underlyingIsin',
            label: 'Underlying ISIN',
            placeholder: 'Enter ISIN',
            type: 'text',
        },
        {
            name: 'redCode',
            label: 'Red Code',
            placeholder: 'Enter Red Code',
            type: 'text',
        },
        {
            name: 'indexSpread',
            label: 'Index/Spread',
            placeholder: 'Spread bps',
            type: 'number',
        },
        {
            name: 'fixedRate',
            label: 'Fixed Rate',
            placeholder: 'Rate %',
            type: 'number',
        },
        {
            name: 'accuredInterest',
            label: 'Accrued Interest',
            placeholder: 'Enter Interest',
            type: 'text',
        },
        {
            name: 'dayCount',
            label: 'Day Count',
            placeholder: 'Select an option',
            type: 'select',
            options: ['30/360', 'ACT/360', 'ACT/365'],
        },
        {
            name: 'firstCoupon',
            label: 'First Coupon Date',
            placeholder: 'dd-mm-yyyy',
            type: 'date',
        },
        {
            name: 'frequency',
            label: 'Frequency',
            placeholder: 'Select an option',
            type: 'select',
            options: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'],
        },
        {
            name: 'tradeRationale',
            label: 'Trade Rationale',
            placeholder: 'Rationale',
            type: 'text',
        },
    ];

    tradeOpFields = [
        {
            name: 'utiId',
            label: 'UTI ID',
            type: 'text',
            placeholder: 'Enter UTI ID',
        },
        {
            name: 'brokerAccount',
            label: 'Broker Account',
            type: 'select',
            placeholder: 'Select Broker Account',
            options: ['Account 1', 'Account 2', 'Account 3', 'Account 4'],
        },
        {
            name: 'utiPrefix',
            label: 'UTI Prefix',
            type: 'text',
            placeholder: 'Enter Prefix',
        },
        {
            name: 'brokerPayAccount',
            label: 'Broker Pay Account',
            type: 'select',
            placeholder: 'Select Pay Account',
            options: ['Pay Account 1', 'Pay Account 2', 'Pay Account 3'],
        },
        {
            name: 'independentAmt',
            label: 'Independent Amt',
            type: 'number',
            placeholder: 'Enter Amount',
        },
        {
            name: 'independentCcy',
            label: 'Independent Ccy',
            type: 'select',
            placeholder: 'Select Currency',
            options: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'],
        },
    ];

    constructor(private fb: FormBuilder) {
        this.tradeForm = this.fb.group({
            account: ['', Validators.required],
            isin: ['', Validators.required],
            tradeName: ['', Validators.required],
            tradeAction: ['', Validators.required],
            counterParty: ['', Validators.required],
            securityId: ['', Validators.required],
            capAllocation: ['', Validators.required],
            description: [''],

            tradeDate: ['', Validators.required],
            settlementDate: ['', Validators.required],
            maturityDate: ['', Validators.required],
            optionExpiry: ['', Validators.required],
            Notional: [''],
            'Trade Price': [''],
            'Upfront Date': [''],
            'FX Rate': [''],
            'Strike Rate': [''],
            'Settlement Type': [''],
            'Option Type': [''],
            'Option Style': [''],

            underlyingIsin: [''],
            redCode: [''],
            fixedRate: [''],
            dayCount: [''],
            frequency: [''],
            indexSpread: [''],
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
                this.closeModal();
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
            message: 'Trade saved as draft',
            position: {
                my: 'center top',
                at: 'center top',
            },
        });
    }

    onPreview() {
        // Implement preview logic
        const previewData = this.tradeForm.value;
        console.log('Preview:', previewData);
    }

    openModal() {
        this.showModal = true;
    }

    closeModal() {
        if (this.tradeForm.dirty) {
            confirm(
                'Are you sure you want to close? Any unsaved changes will be lost.',
                'Confirm close',
            ).then((result) => {
                if (result) {
                    this.showModal = false;
                    this.tradeForm.reset();
                }
            });
        } else {
            this.showModal = false;
        }
    }
}
