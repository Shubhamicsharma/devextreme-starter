import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, formatDate } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxPopoverModule } from 'devextreme-angular/ui/popover';
import { QuickMonitorService } from '../../../shared/core/quick-monitor/quick-monitor.service';
import {
    QuickMonitorDataResponse,
    CommodityTrendMonitorModel,
} from '../../../shared/core/quick-monitor/quick-monitor.model';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';

interface ColumnConfig {
    field: keyof CommodityTrendMonitorModel | 'Empty';
    header: string;
    gradientConfigKey: string;
    group?: string;
    groupIndex?: number;
    headerBgClass?: string;
    maxWidth?: string;
    cellClass?: string;
    type?: 'number' | 'string';
    showChange?: boolean;
}

@Component({
    selector: 'app-commodity-trend-monitor',
    standalone: true,
    imports: [
        CommonModule,
        DxButtonModule,
        DxPopoverModule,
        DxDateBoxModule,
        DxSelectBoxModule,
    ],
    templateUrl: './commodity-trend-monitor.html',
    styleUrl: './commodity-trend-monitor.scss',
})
export class CommodityTrendMonitor implements OnInit, OnDestroy {
    private quickMonitorService = inject(QuickMonitorService);

    data: CommodityTrendMonitorModel[] = [];
    previousData: CommodityTrendMonitorModel[] = [];
    pastData: QuickMonitorDataResponse<CommodityTrendMonitorModel>['Data'] = [];
    lastModified: string | null = null;
    private intervalId: any;
    overlayVisible: boolean = false;

    dataType: 'Live' | 'Past' = 'Live';
    pastDataAvailableTimestamps: { display: string; value: string }[] = [];
    selectedPastDate: Date = new Date('2025-09-05');
    selectedTimestamp: string | null = null;

    columns: ColumnConfig[] = [
        {
            field: 'Commodity',
            header: 'Commodity',
            gradientConfigKey: 'default',
            type: 'string',
            showChange: false,
        },
        {
            field: 'Live',
            header: 'Live',
            gradientConfigKey: 'spotPct',
            type: 'number',
            showChange: true,
        },

        {
            field: 'Empty',
            header: '',
            gradientConfigKey: 'default',
            cellClass:
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--base-bg-darken-5)]',
            type: 'string',
            showChange: false,
        },

        {
            field: 'Z_Sc_1m',
            header: 'Z-Sc(1m)',
            gradientConfigKey: 'zScore',
            headerBgClass: '!bg-blue-100 dark:!bg-blue-900',
            type: 'number',
            showChange: true,
        },
        {
            field: 'Z_Sc_3m',
            header: 'Z-Sc(3m)',
            gradientConfigKey: 'zScore',
            headerBgClass: '!bg-blue-100 dark:!bg-blue-900',
            type: 'number',
            showChange: true,
        },
        {
            field: 'Z_Sc_1y',
            header: 'Z-Sc(1y)',
            gradientConfigKey: 'zScore',
            headerBgClass: '!bg-blue-100 dark:!bg-blue-900',
            type: 'number',
            showChange: true,
        },

        {
            field: 'Empty',
            header: '',
            gradientConfigKey: 'default',
            cellClass:
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--base-bg-darken-5)]',
            type: 'string',
            showChange: false,
        },

        {
            field: 'Chg_1w_pct',
            header: '1w Chg %',
            gradientConfigKey: 'default',
            headerBgClass: '!bg-green-100 dark:!bg-green-900',
            type: 'number',
            showChange: false,
        },
        {
            field: 'Z_1w_chg',
            header: 'Z(1w chg)',
            gradientConfigKey: 'zScore',
            headerBgClass: '!bg-green-100 dark:!bg-green-900',
            type: 'number',
            showChange: true,
        },

        {
            field: 'Empty',
            header: '',
            gradientConfigKey: 'default',
            cellClass:
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--base-bg-darken-5)]',
            type: 'string',
            showChange: false,
        },

        {
            field: 'Chg_1m_pct',
            header: '1m Chg %',
            gradientConfigKey: 'default',
            headerBgClass: '!bg-yellow-100 dark:!bg-yellow-900',
            type: 'number',
            showChange: false,
        },
        {
            field: 'Z_1m_chg',
            header: 'Z(1m chg)',
            gradientConfigKey: 'zScore',
            headerBgClass: '!bg-yellow-100 dark:!bg-yellow-900',
            type: 'number',
            showChange: true,
        },

        {
            field: 'Empty',
            header: '',
            gradientConfigKey: 'default',
            cellClass:
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--base-bg-darken-5)]',
            type: 'string',
            showChange: false,
        },

        {
            field: 'Short_Term',
            header: 'Short-Term',
            gradientConfigKey: 'default',
            headerBgClass: '!bg-purple-100 dark:!bg-purple-900',
            type: 'number',
            showChange: false,
        },
        {
            field: 'Long_Term',
            header: 'Long-Term',
            gradientConfigKey: 'default',
            headerBgClass: '!bg-purple-100 dark:!bg-purple-900',
            type: 'number',
            showChange: false,
        },
    ];

    gradientConfig: any = {
        zScore: [
            {
                min: 1.5,
                max: Infinity,
                color: 'bg-green-200 dark:bg-emerald-600/60',
                label: '> 1.5',
            },
            {
                min: -Infinity,
                max: -1.5,
                color: 'bg-red-200 dark:bg-rose-600/60',
                label: '< -1.5',
            },
        ],
    };

    gradientTemplate: any = {
        zScore: [
            'bg-red-200 dark:bg-rose-600/60',
            'bg-green-200 dark:bg-emerald-600/60',
        ],
    };

    gradientLegend = [{ title: 'Z-Score', key: 'zScore' }];

    constructor(private http: HttpClient, private toast: HotToastService) {}

    ngOnInit(): void {
        this.fetchLiveData();
    }

    fetchPastData(): void {
        const formattedDate = formatDate(
            this.selectedPastDate,
            'yyyy-MM-dd',
            'en-US'
        );
        this.quickMonitorService
            .getQuickMonitorData<
                QuickMonitorDataResponse<CommodityTrendMonitorModel>
            >(new Date(formattedDate), 'Past', 'commoditiesmomentum')
            .subscribe({
                next: (response) => {
                    this.dataType = 'Past';
                    if (
                        Array.isArray(response.Data) &&
                        response.Data.length > 0
                    ) {
                        this.pastData = response.Data;
                        this.pastDataAvailableTimestamps = response.Data.map(
                            (item: any) => ({
                                display: formatDate(
                                    item.Time,
                                    'hh:mm a',
                                    'en-US'
                                ),
                                value: item.Time,
                            })
                        ).sort(
                            (a, b) =>
                                new Date(a.value).getTime() -
                                new Date(b.value).getTime()
                        );

                        if (this.pastDataAvailableTimestamps.length > 0) {
                            this.selectedTimestamp =
                                this.pastDataAvailableTimestamps[0].value;
                            const firstDataPoint = response.Data[0];
                            this.data = firstDataPoint.Data;
                            this.lastModified = new Date(
                                firstDataPoint.Time
                            ).toISOString();
                        }

                        this.toast.success('Successfully fetched past data.');
                    } else {
                        this.data = [];
                        this.pastData = [];
                        this.pastDataAvailableTimestamps = [];
                        this.toast.info(
                            'No past data available for this date.'
                        );
                    }
                },
                error: () => {
                    this.toast.error('Failed to fetch past data.');
                },
            });
    }

    fetchLiveData(): void {
        const toastId = 'live-data-toast';

        this.quickMonitorService
            .getQuickMonitorData<
                QuickMonitorDataResponse<CommodityTrendMonitorModel>
            >(new Date(), 'Live', 'commoditiesmomentum')
            .subscribe({
                next: (response: any) => {
                    this.dataType = response.Type;

                    if (response.Data.length === 0) {
                        this.toast.info('No live data available.', {
                            id: toastId,
                        });
                        return;
                    }

                    response.Data.sort(
                        (a: any, b: any) =>
                            new Date(b.Time).getTime() -
                            new Date(a.Time).getTime()
                    );

                    if (response.Data.length > 1) {
                        this.previousData = response.Data[1].Data;
                        this.data = response.Data[0].Data;
                    }

                    this.lastModified = response.Data[0].Time;
                    this.toast.success('Successfully fetched live data.', {
                        id: toastId,
                    });
                },
                error: () => {
                    this.toast.error('Failed to fetch live data.', {
                        id: toastId,
                    });
                },
            });
    }

    onPastDateChanged(): void {
        this.fetchPastData();
    }

    onTimestampChanged(e: any): void {
        const selectedData = this.pastData.find(
            (item) => item.Time === e.value
        );
        if (selectedData) {
            this.data = selectedData.Data;
            this.lastModified = new Date(selectedData.Time).toISOString();
        }
    }

    ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    getGradientClass(column: ColumnConfig, value: any): string {
        const config = this.gradientConfig[column.gradientConfigKey];
        if (!config) {
            return '';
        }
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            return '';
        }
        const found = config.find(
            (item: any) => numericValue >= item.min && numericValue < item.max
        );
        return found ? found.color : '';
    }

    getChange(rowIndex: number, col: string): string {
        if (
            this.dataType === 'Live' &&
            this.previousData.length > rowIndex &&
            this.data.length > rowIndex
        ) {
            const key = col as keyof CommodityTrendMonitorModel;
            const previousValue = this.previousData[rowIndex][key];
            const currentValue = this.data[rowIndex][key];
            if (previousValue < currentValue) {
                return 'pi pi-arrow-up text-green-500';
            } else if (previousValue > currentValue) {
                return 'pi pi-arrow-down text-red-500';
            }
        }
        return '';
    }

    toggle() {
        this.overlayVisible = !this.overlayVisible;
    }
}
