import { Routes } from '@angular/router';
import { CurrencyTrendMonitor } from './currency-trend-monitor/currency-trend-monitor';
import { RatesTrendMonitor } from './rates-trend-monitor/rates-trend-monitor';
import { IndexTrendMonitor } from './index-trend-monitor/index-trend-monitor';
import { CommodityTrendMonitor } from './commodity-trend-monitor/commodity-trend-monitor';

export const QUICK_MONITOR_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'currency',
    },
    {
        path: 'currency',
        component: CurrencyTrendMonitor
    },
    {
        path: 'rates',
        component: RatesTrendMonitor
    },
    {
        path: 'index',
        component: IndexTrendMonitor
    },
    {
        path: 'commodity',
        component: CommodityTrendMonitor,
    },
];
