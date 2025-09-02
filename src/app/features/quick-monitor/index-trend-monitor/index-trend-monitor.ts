import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxPopoverModule } from 'devextreme-angular/ui/popover';

interface IndexData {
    [key: string]: any;
}

interface ColumnConfig {
    field: string;
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
    selector: 'app-index-trend-monitor',
    standalone: true,
    imports: [CommonModule, DxButtonModule, DxPopoverModule],
    templateUrl: './index-trend-monitor.html',
    styleUrl: './index-trend-monitor.scss',
})
export class IndexTrendMonitor implements OnInit, OnDestroy {
    data: IndexData[] = [];
    previousData: IndexData[] = [];
    lastModified: string | null = null;
    private intervalId: any;
    overlayVisible: boolean = false;

    columns: ColumnConfig[] = [
        {
            field: 'Index',
            header: 'Index',
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
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--surface-ground)]',
            type: 'string',
            showChange: false,
        },

        {
            field: 'Z-Sc(1m)',
            header: 'Z-Sc(1m)',
            gradientConfigKey: 'zScore',
            headerBgClass: '!bg-blue-100 dark:!bg-blue-900',
            type: 'number',
            showChange: true,
        },
        {
            field: 'Z-Sc(3m)',
            header: 'Z-Sc(3m)',
            gradientConfigKey: 'zScore',
            headerBgClass: '!bg-blue-100 dark:!bg-blue-900',
            type: 'number',
            showChange: true,
        },
        {
            field: 'Z-Sc(1y)',
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
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--surface-ground)]',
            type: 'string',
            showChange: false,
        },

        {
            field: '1w Chg %',
            header: '1w Chg %',
            gradientConfigKey: 'default',
            headerBgClass: '!bg-green-100 dark:!bg-green-900',
            type: 'number',
            showChange: false,
        },
        {
            field: 'Z(1w chg)',
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
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--surface-ground)]',
            type: 'string',
            showChange: false,
        },

        {
            field: '1m Chg %',
            header: '1m Chg %',
            gradientConfigKey: 'default',
            headerBgClass: '!bg-yellow-100 dark:!bg-yellow-900',
            type: 'number',
            showChange: false,
        },
        {
            field: 'Z(1m chg)',
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
                '!w-[15px] !border-b-0 !px-0 !bg-[var(--surface-ground)]',
            type: 'string',
            showChange: false,
        },

        {
            field: 'Short-Term',
            header: 'Short Term',
            gradientConfigKey: 'default',
            headerBgClass: '!bg-purple-100 dark:!bg-purple-900',
            type: 'number',
            showChange: false,
        },
        {
            field: 'Long-Term',
            header: 'Long Term',
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
        this.fetchExcel();
        this.intervalId = setInterval(() => this.fetchExcel(), 5000);
    }

    fetchExcel(): void {
        this.http
            .get('assets/CmdMomentum 1.xlsx', {
                responseType: 'arraybuffer',
                observe: 'response',
            })
            .subscribe({
                next: (response) => {
                    const lastModified = response.headers.get('Last-Modified');
                    if (lastModified !== this.lastModified) {
                        this.lastModified = lastModified;
                        this.previousData = JSON.parse(
                            JSON.stringify(this.data)
                        );
                        const data = new Uint8Array(
                            response.body as ArrayBuffer
                        );
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData: any[] = (XLSX.utils.sheet_to_json as any)(
                            worksheet,
                            { defval: '' }
                        );
                        this.data = jsonData;
                        this.toast.success('Successfully fetched latest data.');
                    }
                },
                error: () => {
                    this.toast.error('Error fetching Excel file.');
                },
            });
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
        if (this.previousData.length > rowIndex) {
            const previousValue = this.previousData[rowIndex][col];
            const currentValue = this.data[rowIndex][col];
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
